import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrast, mix, readCssVariables, sampleArc, toHex } from "../../src/lib/contrast";

const css = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8");
const vars = readCssVariables(css);
const v = (name: string) => {
  const value = vars.get(name);
  if (!value) throw new Error(`${name} is not defined in tokens.css`);
  return value;
};

// Body text aims for AAA (7:1) in both themes; secondary text, links and
// focus rings must clear AA (4.5:1); borders and focus rings as non-text
// contrast must clear 3:1. Section 9.1 of the plan.
const AAA = 7;
const AA = 4.5;
const NON_TEXT = 3;

describe("light theme tokens", () => {
  const bg = v("--paper");
  const surface = v("--surface-light");
  it("body text is AAA on paper and on the surface tint", () => {
    expect(contrast(v("--ink"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--ink"), surface)).toBeGreaterThanOrEqual(AAA);
  });
  it("ember accent is AAA on paper and AA on the surface tint", () => {
    expect(contrast(v("--ember"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--ember"), surface)).toBeGreaterThanOrEqual(AA);
  });
  it("raw lamp is not used as text on paper", () => {
    expect(contrast(v("--lamp"), bg)).toBeLessThan(AA);
  });
  it("smoke, signals and borders clear their thresholds on paper", () => {
    expect(contrast(v("--smoke-on-paper"), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--smoke-on-paper"), surface)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--signal-ok-light"), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--signal-error-light"), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--border-light"), bg)).toBeGreaterThanOrEqual(NON_TEXT);
    expect(contrast(v("--border-light"), surface)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe("dark theme tokens", () => {
  const bg = v("--ink");
  const surface = v("--surface-dark");
  it("paper text is AAA on ink and on the surface tint", () => {
    expect(contrast(v("--paper"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--paper"), surface)).toBeGreaterThanOrEqual(AAA);
  });
  it("lamp and the dimmed lamp are AAA on ink and the surface tint", () => {
    expect(contrast(v("--lamp"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--lamp-dim"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--lamp-dim"), surface)).toBeGreaterThanOrEqual(AAA);
  });
  it("smoke, signals and borders clear their thresholds on ink", () => {
    expect(contrast(v("--smoke-on-ink"), bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--signal-ok-dark"), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--signal-error-dark"), bg)).toBeGreaterThanOrEqual(AA);
    expect(contrast(v("--border-dark"), bg)).toBeGreaterThanOrEqual(NON_TEXT);
    expect(contrast(v("--border-dark"), surface)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});

describe("home page movements", () => {
  it("dusk ground carries paper, smoke and lamp text", () => {
    const dusk = v("--dusk");
    expect(contrast(v("--paper"), dusk)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--smoke-on-ink"), dusk)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(v("--lamp"), dusk)).toBeGreaterThanOrEqual(AA);
  });
  it("the sampler reports a ratio for each point of an arc", () => {
    const samples = sampleArc(v("--ink"), v("--paper"), [v("--paper"), v("--ink")], 10);
    expect(samples).toHaveLength(11);
    expect(samples[0]?.ratio).toBeGreaterThan(16);
    expect(samples[10]?.ratio).toBeGreaterThan(16);
  });
});

describe("high contrast mode", () => {
  const read = (selector: string) => {
    const block = css.split(selector)[1]?.split("}")[0] ?? "";
    return readCssVariables(block + ";");
  };
  it("light high contrast is at least 7:1 for every text token", () => {
    const hc = read(':root[data-contrast="high"] {');
    const bg = hc.get("--bg")!;
    for (const name of ["--fg", "--fg-muted", "--accent", "--ok", "--error"]) {
      expect(contrast(hc.get(name)!, bg), name).toBeGreaterThanOrEqual(AAA);
    }
  });
  it("dark high contrast is at least 7:1 for every text token", () => {
    const hc = read(':root[data-theme="dark"][data-contrast="high"] {');
    const bg = hc.get("--bg")!;
    for (const name of ["--fg", "--fg-muted", "--accent", "--ok", "--error"]) {
      expect(contrast(hc.get(name)!, bg), name).toBeGreaterThanOrEqual(AAA);
    }
  });
});

describe("contrast helpers", () => {
  it("computes the known black on white ratio", () => {
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });
  it("mixes colors linearly in sRGB", () => {
    expect(toHex(mix("#000000", "#ffffff", 0.5))).toBe("#808080");
  });
});
