// Local server for the built site, used by the Playwright suites, Lighthouse
// CI, the PDF step and `npm run preview`. The Vercel adapter does not support
// `astro preview`, so this mirrors what Vercel does: static files from
// dist/client (with the no-trailing-slash redirect from vercel.json), and
// everything else handed to the server entry that becomes the Vercel function
// (the contact form, the 404 page).
//   node scripts/serve.mjs --port 4321
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CLIENT = path.resolve("dist/client");
// The adapter writes the function entry here; the copy inside the .func folder is the same file.
const ENTRY = [".vercel/output/_functions/entry.mjs", ".vercel/output/server/entry.mjs"]
  .map((p) => path.resolve(p))
  .find((p) => existsSync(p));
const port = Number(process.argv[process.argv.indexOf("--port") + 1] || 4321);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".xsl": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
  ".wasm": "application/wasm",
  ".pf_meta": "application/octet-stream",
  ".pf_index": "application/octet-stream",
  ".pf_fragment": "application/octet-stream",
  ".pagefind": "application/octet-stream",
};

function staticFile(urlPath) {
  const clean = decodeURIComponent(urlPath);
  if (clean.includes("..")) return null;
  const candidates = [
    path.join(CLIENT, clean),
    path.join(CLIENT, clean, "index.html"),
    path.join(CLIENT, `${clean}.html`),
  ];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

// The adapter entry is a fetch handler: { fetch(request) }. Node requests are
// converted to web Requests and the Response is written back.
let fetchHandler = null;
if (ENTRY) {
  const mod = await import(pathToFileURL(ENTRY).href);
  const entry = mod.default ?? mod;
  fetchHandler = typeof entry === "function" ? entry : (entry.fetch?.bind(entry) ?? null);
}

async function callFunction(req, res, url) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
  headers.set("x-forwarded-for", req.socket.remoteAddress ?? "127.0.0.1");
  const request = new Request(url, {
    method: req.method,
    headers,
    body: body && req.method !== "GET" && req.method !== "HEAD" ? body : undefined,
  });
  const response = await fetchHandler(request);
  const out = {};
  response.headers.forEach((v, k) => {
    out[k] = v;
  });
  res.writeHead(response.status, out);
  res.end(Buffer.from(await response.arrayBuffer()));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);
  // vercel.json: trailingSlash false.
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    res.writeHead(308, { Location: url.pathname.replace(/\/+$/, "") + url.search });
    res.end();
    return;
  }
  const file = staticFile(url.pathname);
  if (file) {
    const ext = path.extname(file);
    const type = types[ext] ?? "application/octet-stream";
    const headers = {
      "Content-Type": type,
      "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=31536000, immutable",
    };
    let body = readFileSync(file);
    // Vercel compresses text responses; so does this server, so Lighthouse sees the same bytes.
    const compressible =
      type.startsWith("text/") ||
      [
        "application/json",
        "application/xml",
        "application/javascript",
        "application/manifest+json",
      ].some((t) => type.startsWith(t));
    if (compressible && (req.headers["accept-encoding"] ?? "").includes("gzip")) {
      body = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
    }
    res.writeHead(200, headers);
    res.end(body);
    return;
  }
  if (fetchHandler) {
    try {
      await callFunction(req, res, url);
      return;
    } catch (error) {
      console.error(error);
    }
  }
  const notFound = staticFile("/404");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(notFound ? readFileSync(notFound) : "Not found");
});

server.listen(port, () => {
  console.log(
    `serve: http://localhost:${port} (static from dist/client${fetchHandler ? ", functions from the server entry" : ""})`,
  );
});
