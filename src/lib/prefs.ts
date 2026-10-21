// Visitor preferences: theme and the reading controls (section 6.8). Stored in
// localStorage under one key and mirrored to data attributes on <html>, which
// the CSS tokens read. The inline script in PrefsScript.astro applies the same
// attributes before first paint; this module is the typed version the islands
// use after load. Storage can be missing or throw (private windows, blocked
// site data), so every read and write is guarded and the page renders with
// defaults when it is.

export type Theme = "light" | "dark";
export type TextSize = "100" | "125" | "150" | "175" | "200";
export type LineSpacing = "normal" | "loose";

export type Prefs = {
  theme: Theme | "system";
  textSize: TextSize;
  lineSpacing: LineSpacing;
  highContrast: boolean;
  dyslexia: boolean;
  reduceMotion: boolean;
};

export const PREFS_KEY = "mw-prefs";
export const PREFS_EVENT = "mw:prefs";

export const DEFAULT_PREFS: Prefs = {
  theme: "system",
  textSize: "100",
  lineSpacing: "normal",
  highContrast: false,
  dyslexia: false,
  reduceMotion: false,
};

const TEXT_SIZES: TextSize[] = ["100", "125", "150", "175", "200"];

export function sanitize(input: unknown): Prefs {
  const p = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    theme: p.theme === "light" || p.theme === "dark" ? p.theme : "system",
    textSize: TEXT_SIZES.includes(p.textSize as TextSize) ? (p.textSize as TextSize) : "100",
    lineSpacing: p.lineSpacing === "loose" ? "loose" : "normal",
    highContrast: p.highContrast === true,
    dyslexia: p.dyslexia === true,
    reduceMotion: p.reduceMotion === true,
  };
}

export function readPrefs(): Prefs {
  try {
    const raw = globalThis.localStorage?.getItem(PREFS_KEY);
    return raw ? sanitize(JSON.parse(raw)) : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function systemTheme(): Theme {
  try {
    return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function resolvedTheme(prefs: Prefs): Theme {
  return prefs.theme === "system" ? systemTheme() : prefs.theme;
}

/** The browser bar colors, matching --paper and --ink in tokens.css. */
export const THEME_COLORS: Record<Theme, string> = { light: "#f6f2ea", dark: "#141210" };

/**
 * Point every theme-color tag at the chosen theme. The tags carry a
 * prefers-color-scheme media query for the first paint; without this, a
 * visitor who picked the other theme keeps the system's bar color.
 */
export function syncThemeColor(theme: Theme, doc: Document = document): void {
  for (const meta of doc.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = THEME_COLORS[theme];
  }
}

/** Mirror prefs onto <html> so the CSS tokens pick them up. */
export function applyPrefs(prefs: Prefs, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = resolvedTheme(prefs);
  syncThemeColor(resolvedTheme(prefs), root.ownerDocument);
  root.dataset.textSize = prefs.textSize;
  root.dataset.lineSpacing = prefs.lineSpacing;
  root.dataset.contrast = prefs.highContrast ? "high" : "normal";
  root.dataset.dyslexia = prefs.dyslexia ? "on" : "off";
  root.dataset.motion = prefs.reduceMotion ? "reduce" : "auto";
}

export function writePrefs(next: Partial<Prefs>): Prefs {
  const merged = sanitize({ ...readPrefs(), ...next });
  try {
    globalThis.localStorage?.setItem(PREFS_KEY, JSON.stringify(merged));
  } catch {
    // Storage unavailable: the page still updates for this visit.
  }
  if (typeof document !== "undefined") {
    applyPrefs(merged);
    document.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: merged }));
  }
  return merged;
}

/**
 * The script that runs inline in <head> before first paint. Kept as a string
 * here so the unit test can execute it and the layout can hash it for the
 * Content Security Policy. It must stay plain ES5 and self-contained.
 */
export const INLINE_PREFS_SCRIPT = `(function(){var d=document.documentElement;var p={};try{var r=localStorage.getItem(${JSON.stringify(PREFS_KEY)});if(r){p=JSON.parse(r)||{}}}catch(e){}var dark=false;try{dark=matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}var t=p.theme==="light"||p.theme==="dark"?p.theme:(dark?"dark":"light");d.setAttribute("data-theme",t);var s=["100","125","150","175","200"];d.setAttribute("data-text-size",s.indexOf(p.textSize)>-1?p.textSize:"100");d.setAttribute("data-line-spacing",p.lineSpacing==="loose"?"loose":"normal");d.setAttribute("data-contrast",p.highContrast===true?"high":"normal");d.setAttribute("data-dyslexia",p.dyslexia===true?"on":"off");d.setAttribute("data-motion",p.reduceMotion===true?"reduce":"auto");})();`;
