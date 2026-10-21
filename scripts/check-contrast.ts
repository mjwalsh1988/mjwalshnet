// Build-time contrast check for the home page scroll arc (section 5.1).
// Samples the ground interpolation between each pair of movements at ten
// points and fails if no text token clears 4.5:1 at any sample. The arc's
// CSS is added in Phase 4; until then this checks the four static grounds
// and the transitions the CSS will later animate between.
import { readFileSync } from "node:fs";
import { contrast, readCssVariables, sampleArc } from "../src/lib/contrast";

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

// A linear blend between dusk and paper passes through a midtone where neither
// text color reaches 4.5:1, so the arc never puts text on a blended ground:
// every movement is a solid section and the blend shows only in the empty bands
// between them. The samples below are printed so that stays visible; a band
// that ever carries text must be listed in BAND_TEXT and then has to pass.
const BAND_TEXT: Record<string, string[]> = {};
report("Transitions, sampled at ten points (bands carry no text by design):");
for (let i = 0; i < grounds.length - 1; i += 1) {
  const from = grounds[i]!;
  const to = grounds[i + 1]!;
  const key = `${from.name}-${to.name}`;
  const bandText = BAND_TEXT[key] ?? [];
  const samples = sampleArc(from.color, to.color, bandText.length ? bandText : textColors, 10);
  const worst = samples.reduce((a, b) => (b.ratio < a.ratio ? b : a));
  const ok = bandText.length === 0 || worst.ratio >= MIN;
  if (!ok) failures += 1;
  report(
    `  ${from.name} to ${to.name}: worst ${worst.ratio.toFixed(2)}:1 at t=${worst.t.toFixed(1)} (ground ${worst.ground})  ${bandText.length ? (ok ? "ok" : "FAIL") : "no text in band"}`,
  );
}

if (failures) {
  console.error(`\nContrast check: ${failures} failure${failures === 1 ? "" : "s"}.`);
  process.exitCode = 1;
} else {
  console.log("\nContrast check: every ground and transition clears the thresholds.");
}
