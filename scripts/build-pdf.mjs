// Prints the built /resume page to dist/resume.pdf with Playwright, so the
// PDF can never drift from the page (section 6.9). Serves the dist folder on a
// local port for the print run. Where no browser is installed (the Vercel
// build), it logs one line and keeps the committed public/resume.pdf, which
// Astro has already copied into dist.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const DIST = path.join("dist", "client");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(DIST, clean),
    path.join(DIST, clean, "index.html"),
    path.join(DIST, `${clean}.html`),
  ];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const server = createServer((req, res) => {
  const file = resolveFile(req.url ?? "/");
  if (!file) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

try {
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto(`http://127.0.0.1:${port}/resume`, { waitUntil: "networkidle" });
  const out = path.join(DIST, "resume.pdf");
  await page.pdf({
    path: out,
    format: "Letter",
    printBackground: false,
    margin: { top: "0.6in", right: "0.6in", bottom: "0.6in", left: "0.6in" },
  });
  await browser.close();
  console.log(`build-pdf: wrote ${out}`);
  // Keep the committed copy current so a build without a browser still ships a fresh PDF.
  mkdirSync("public", { recursive: true });
  copyFileSync(out, path.join("public", "resume.pdf"));
  const vercelStatic = path.join(".vercel", "output", "static");
  if (existsSync(vercelStatic)) copyFileSync(out, path.join(vercelStatic, "resume.pdf"));
} catch (error) {
  console.log(
    `build-pdf: no browser available here (${error.message.split("\n")[0]}); keeping the committed public/resume.pdf`,
  );
} finally {
  server.close();
}
