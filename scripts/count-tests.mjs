// Counts this repository's automated tests by asking each runner to list them,
// without running any. Playwright's list includes one budget test per built
// page, so this runs after the build, from scripts/postbuild.mjs.
//   node scripts/count-tests.mjs   prints the counts
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const run = (args) =>
  execFileSync(process.execPath, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 32 * 1024 * 1024,
  });

export function countTests() {
  const listed = run(["node_modules/@playwright/test/cli.js", "test", "--list"]);
  const total = listed.match(/Total: (\d+) tests? in/);
  if (!total) throw new Error("Playwright did not report a total");
  const unit = JSON.parse(run(["node_modules/vitest/vitest.mjs", "list", "--json"]));
  if (!Array.isArray(unit)) throw new Error("Vitest did not return a list");
  const playwright = Number(total[1]);
  return { playwright, unit: unit.length, total: playwright + unit.length };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  console.log(countTests());
}
