// Runs after `astro build`. Builds the Pagefind search index over the static
// output, then mirrors it into the Vercel Build Output folder, which the
// adapter has already copied by the time this runs.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const pagefindBin = require.resolve("pagefind/lib/runner/bin.cjs");

execFileSync(process.execPath, [pagefindBin, "--site", "dist"], { stdio: "inherit" });

const vercelStatic = path.join(".vercel", "output", "static");
if (existsSync(vercelStatic)) {
  const target = path.join(vercelStatic, "pagefind");
  rmSync(target, { recursive: true, force: true });
  cpSync(path.join("dist", "pagefind"), target, { recursive: true });
  console.log(`postbuild: copied the Pagefind index to ${target}`);
}
