// Social card renderer (section 10.3): title, eyebrow and the braille mark on
// the page's ground color, 1200 by 630, rendered at build with satori and
// sharp. Fonts are the TTF builds in src/assets/fonts/og (OFL licensed).
import { readFileSync } from "node:fs";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

export type OgInput = {
  title: string;
  eyebrow?: string;
  /** Short line under the title: a date and reading time, or the site name. */
  meta?: string;
  ground?: "ink" | "paper";
};

const INK = "#141210";
const PAPER = "#f6f2ea";
const LAMP = "#d9941f";
const EMBER = "#73420a";
const SMOKE_ON_INK = "#b3ada3";
const SMOKE_ON_PAPER = "#5e5a54";

// Resolved from the project root: the endpoint runs at build time, where the
// bundled chunk no longer sits next to the source folder.
const fontDir = path.resolve(process.cwd(), "src/assets/fonts/og");
const fontFile = (name: string) => readFileSync(path.join(fontDir, name));
const fonts = [
  {
    name: "Fraunces",
    data: fontFile("Fraunces-Variable.ttf"),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Atkinson",
    data: fontFile("AtkinsonHyperlegibleNext-Variable.ttf"),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "JetBrains Mono",
    data: fontFile("JetBrainsMono-Variable.ttf"),
    weight: 400 as const,
    style: "normal" as const,
  },
];

// Braille cells for M (1, 3, 4) and W (2, 4, 5, 6).
function mark(color: string, size: number) {
  const unit = size / 44;
  const cell = (x: number, dots: number[]) =>
    [1, 2, 3, 4, 5, 6].map((n) => ({
      left: (n <= 3 ? x : x + 10) * unit,
      top: (5 + ((n - 1) % 3) * 10) * unit,
      on: dots.includes(n),
    }));
  const dots = [...cell(6, [1, 3, 4]), ...cell(28, [2, 4, 5, 6])];
  return {
    type: "div",
    props: {
      style: { position: "relative", width: size, height: 30 * unit, display: "flex" },
      children: dots.map((d) => ({
        type: "div",
        props: {
          style: {
            position: "absolute",
            left: d.left - (d.on ? 4 : 1.4) * unit,
            top: d.top - (d.on ? 4 : 1.4) * unit,
            width: (d.on ? 8 : 2.8) * unit,
            height: (d.on ? 8 : 2.8) * unit,
            borderRadius: 999,
            background: color,
            opacity: d.on ? 1 : 0.35,
          },
        },
      })),
    },
  };
}

function fitTitle(title: string): number {
  if (title.length <= 24) return 92;
  if (title.length <= 44) return 72;
  if (title.length <= 70) return 58;
  return 46;
}

export async function renderOgSvg(input: OgInput): Promise<string> {
  const dark = (input.ground ?? "paper") === "ink";
  const bg = dark ? INK : PAPER;
  const fg = dark ? PAPER : INK;
  const muted = dark ? SMOKE_ON_INK : SMOKE_ON_PAPER;
  const accent = dark ? LAMP : EMBER;

  // Satori adds padding outside the box it sizes, so padding on the root would
  // push the footer past the canvas. The root is the plain ground and an
  // absolutely positioned inner frame carries the margins.
  const tree = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        background: bg,
        color: fg,
        fontFamily: "Atkinson",
      },
      children: {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 72,
            left: 72,
            right: 72,
            bottom: 72,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
          children: [
            {
              type: "div",
              props: {
                style: { display: "flex", alignItems: "center", gap: 28 },
                children: [
                  mark(accent, 66),
                  {
                    type: "div",
                    props: {
                      style: {
                        fontFamily: "JetBrains Mono",
                        fontSize: 26,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: muted,
                      },
                      children: input.eyebrow ?? "mjwalsh.net",
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontFamily: "Fraunces",
                  fontSize: fitTitle(input.title),
                  lineHeight: 1.08,
                  letterSpacing: -1,
                  maxWidth: 1000,
                  display: "flex",
                },
                children: input.title,
              },
            },
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  fontSize: 28,
                  color: muted,
                },
                children: [
                  { type: "div", props: { children: input.meta ?? "Michael Walsh" } },
                  {
                    type: "div",
                    props: {
                      style: { fontFamily: "JetBrains Mono", fontSize: 24, color: accent },
                      children: "mjwalsh.net",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  };

  // satori's typings expect a React node; the plain object form is what it consumes.
  return satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  });
}

export async function renderOgPng(input: OgInput): Promise<Buffer> {
  const svg = await renderOgSvg(input);
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
