// Runs after `astro build`. Builds the Pagefind search index over the static
// output, then mirrors it into the Vercel Build Output folder, which the
// adapter has already copied by the time this runs.
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import * as pagefind from "pagefind";

const { index, errors } = await pagefind.createIndex();
if (!index) throw new Error(`pagefind: could not create an index: ${errors.join("; ")}`);

const added = await index.addDirectory({ path: "dist" });
if (added.errors.length) throw new Error(`pagefind: ${added.errors.join("; ")}`);

const written = await index.writeFiles({ outputPath: path.join("dist", "pagefind") });
if (written.errors.length) throw new Error(`pagefind: ${written.errors.join("; ")}`);
console.log(`postbuild: indexed ${added.page_count} pages for search`);
await pagefind.close();

const vercelStatic = path.join(".vercel", "output", "static");
if (existsSync(vercelStatic)) {
  const target = path.join(vercelStatic, "pagefind");
  rmSync(target, { recursive: true, force: true });
  cpSync(path.join("dist", "pagefind"), target, { recursive: true });
  console.log(`postbuild: copied the search index to ${target}`);
}
