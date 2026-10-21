import { describe, expect, it } from "vitest";
import { DEFAULT_PREFS, INLINE_PREFS_SCRIPT, PREFS_KEY, sanitize } from "../../src/lib/prefs";

function runInline(stored: string | null, prefersDark: boolean) {
  const attrs: Record<string, string> = {};
  const document = {
    documentElement: {
      setAttribute(name: string, value: string) {
        attrs[name] = value;
      },
    },
  };
  const localStorage = {
    getItem(key: string) {
      return key === PREFS_KEY ? stored : null;
    },
  };
  const matchMedia = () => ({ matches: prefersDark });
  new Function("document", "localStorage", "matchMedia", INLINE_PREFS_SCRIPT)(
    document,
    localStorage,
    matchMedia,
  );
  return attrs;
}

describe("sanitize", () => {
  it("falls back to defaults for junk", () => {
    expect(sanitize(null)).toEqual(DEFAULT_PREFS);
    expect(sanitize({ theme: "blue", textSize: "900", highContrast: "yes" })).toEqual(
      DEFAULT_PREFS,
    );
  });
  it("keeps valid values", () => {
    expect(
      sanitize({ theme: "dark", textSize: "150", lineSpacing: "loose", dyslexia: true }),
    ).toEqual({
      ...DEFAULT_PREFS,
      theme: "dark",
      textSize: "150",
      lineSpacing: "loose",
      dyslexia: true,
    });
  });
});

describe("inline prefs script", () => {
  it("follows the system theme when nothing is stored", () => {
    expect(runInline(null, true)["data-theme"]).toBe("dark");
    expect(runInline(null, false)["data-theme"]).toBe("light");
  });
  it("applies stored preferences and ignores bad ones", () => {
    const attrs = runInline(
      JSON.stringify({ theme: "light", textSize: "175", highContrast: true, reduceMotion: true }),
      true,
    );
    expect(attrs).toEqual({
      "data-theme": "light",
      "data-text-size": "175",
      "data-line-spacing": "normal",
      "data-contrast": "high",
      "data-dyslexia": "off",
      "data-motion": "reduce",
    });
  });
  it("survives unreadable storage", () => {
    const attrs = runInline("not json", false);
    expect(attrs["data-theme"]).toBe("light");
    expect(attrs["data-text-size"]).toBe("100");
  });
});
