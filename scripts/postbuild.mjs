// Runs after `astro build`. Writes the test count into the built pages, builds
// the Pagefind search index over the static output, then mirrors it into the
// Vercel Build Output folder, which the adapter has already copied by the time
// this runs.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";
import { countTests } from "./count-tests.mjs";

const vercelStatic = path.join(".vercel", "output", "static");

// The number of automated tests can only be counted once the pages exist,
// because Playwright lists one budget test per built page. It replaces the
// snapshot figure the build rendered. If counting fails the snapshot stays.
function htmlFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}
try {
  const counts = countTests();
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const long = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(today);
  const value = new Intl.NumberFormat("en-US").format(counts.total);
  const source = `Source: This repository, ${counts.playwright} Playwright tests and ${counts.unit} unit tests, counted at build, as of <time datetime="${iso}">${long}</time>`;
  const shortSource = "Source: This repository, counted at build";
  let patched = 0;
  for (const file of [...htmlFiles(path.join("dist", "client")), ...htmlFiles(vercelStatic)]) {
    const html = readFileSync(file, "utf8");
    if (!html.includes('data-metric-value="automated_tests"')) continue;
    const next = html
      .replace(
        /(<span[^>]*data-metric-value="automated_tests"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${value}$2`,
      )
      .replace(
        /(<span[^>]*data-metric-source="automated_tests"[^>]*>)[\s\S]*?(<\/span>)/,
        // The compact strip on the home page keeps to a short source line.
        (_match, open, close) =>
          `${open}${open.includes("data-compact") ? shortSource : source}${close}`,
      );
    writeFileSync(file, next);
    patched += 1;
  }
  console.log(`postbuild: ${counts.total} automated tests, written into ${patched} pages`);
} catch (error) {
  console.warn(
    `postbuild: could not count the tests (${error.message}); the snapshot figure stays`,
  );
}

const { index, errors } = await pagefind.createIndex();
if (!index) throw new Error(`pagefind: could not create an index: ${errors.join("; ")}`);

const added = await index.addDirectory({ path: "dist/client" });
if (added.errors.length) throw new Error(`pagefind: ${added.errors.join("; ")}`);

const written = await index.writeFiles({ outputPath: path.join("dist", "client", "pagefind") });
if (written.errors.length) throw new Error(`pagefind: ${written.errors.join("; ")}`);
console.log(`postbuild: indexed ${added.page_count} pages for search`);
await pagefind.close();

if (existsSync(vercelStatic)) {
  const target = path.join(vercelStatic, "pagefind");
  rmSync(target, { recursive: true, force: true });
  cpSync(path.join("dist", "client", "pagefind"), target, { recursive: true });
  console.log(`postbuild: copied the search index to ${target}`);
}
