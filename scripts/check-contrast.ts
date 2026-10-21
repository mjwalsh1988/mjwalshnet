// Build-time contrast check for the home page arc (section 5.1). The four
// movements are solid grounds that meet edge to edge with no blend between
// them, so each ground is checked against its text and accent colors.
import { readFileSync } from "node:fs";
import { contrast, readCssVariables } from "../src/lib/contrast";

const tokens = readCssVariables(readFileSync("src/styles/tokens.css", "utf8"));
const v = (name: string) => {
  const value = tokens.get(name);
  if (!value) throw new Error(`${name} missing from tokens.css`);
  return value;
};

const MIN = 4.5;
const grounds = [
  { name: "dark", color: v("--ground-dark") },
  { name: "dusk", color: v("--ground-dusk") },
  { name: "dawn", color: v("--ground-dawn") },
  { name: "day", color: v("--ground-day") },
];
const textColors = [v("--paper"), v("--ink")];
const accents = { dark: v("--lamp"), light: v("--ember") };

let failures = 0;
const report = (line: string) => console.log(line);

report("Static grounds:");
for (const g of grounds) {
  const best = Math.max(...textColors.map((t) => contrast(g.color, t)));
  const accent = Math.max(contrast(g.color, accents.dark), contrast(g.color, accents.light));
  const ok = best >= 7 && accent >= MIN;
  if (!ok) failures += 1;
  report(
    `  ${g.name.padEnd(5)} ${g.color}  text ${best.toFixed(2)}:1  accent ${accent.toFixed(2)}:1  ${ok ? "ok" : "FAIL"}`,
  );
}

if (failures) {
  console.error(`\nContrast check: ${failures} failure${failures === 1 ? "" : "s"}.`);
  process.exitCode = 1;
} else {
  console.log("\nContrast check: every ground clears the thresholds.");
}
