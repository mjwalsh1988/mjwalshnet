// WCAG 2.x contrast arithmetic. Used by the token tests, the home page scroll
// arc sampler and the build-time contrast check.

export type Rgb = { r: number; g: number; b: number };

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Not a hex color: ${hex}`);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function toHex({ r, g, b }: Rgb): string {
  const part = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance per WCAG 2.x. */
export function luminance(color: Rgb | string): number {
  const { r, g, b } = typeof color === "string" ? parseHex(color) : color;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two colors, 1 to 21. */
export function contrast(a: Rgb | string, b: Rgb | string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Linear interpolation in sRGB space, which is what CSS color-mix in srgb and
 * scroll-driven animations of a hex color do. */
export function mix(from: Rgb | string, to: Rgb | string, t: number): Rgb {
  const a = typeof from === "string" ? parseHex(from) : from;
  const b = typeof to === "string" ? parseHex(to) : to;
  const k = Math.max(0, Math.min(1, t));
  return {
    r: a.r + (b.r - a.r) * k,
    g: a.g + (b.g - a.g) * k,
    b: a.b + (b.b - a.b) * k,
  };
}

/** Sample a ground interpolation at n evenly spaced points and return the
 * worst contrast against the best of the given text colors at each point. */
export function sampleArc(
  from: string,
  to: string,
  textColors: string[],
  points = 10,
): { t: number; ground: string; best: string; ratio: number }[] {
  const out: { t: number; ground: string; best: string; ratio: number }[] = [];
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const ground = toHex(mix(from, to, t));
    let best = textColors[0] ?? "#000000";
    let ratio = 0;
    for (const text of textColors) {
      const r = contrast(ground, text);
      if (r > ratio) {
        ratio = r;
        best = text;
      }
    }
    out.push({ t, ground, best, ratio });
  }
  return out;
}

/** Read `--name: value;` declarations from a CSS source, resolving var() references. */
export function readCssVariables(css: string): Map<string, string> {
  const raw = new Map<string, string>();
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const name = m[1];
    const value = m[2]?.trim();
    if (name && value && !raw.has(name)) raw.set(name, value);
  }
  const resolve = (value: string, depth = 0): string => {
    if (depth > 10) return value;
    return value.replace(/var\((--[\w-]+)\)/g, (_, ref: string) =>
      resolve(raw.get(ref) ?? "", depth + 1),
    );
  };
  const resolved = new Map<string, string>();
  for (const [k, v] of raw) resolved.set(k, resolve(v));
  return resolved;
}
