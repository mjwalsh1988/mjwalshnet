// Renders the braille mark (M: dots 1, 3, 4; W: dots 2, 4, 5, 6) to the
// favicon set in public/. Run once with `node scripts/build-icons.mjs` and
// commit the output; the files are small and change only if the mark does.
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const INK = "#141210";
const PAPER = "#f6f2ea";
const LAMP = "#d9941f";

function cell(x, dots) {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    cx: n <= 3 ? x : x + 10,
    cy: 5 + ((n - 1) % 3) * 10,
    on: dots.includes(n),
  }));
}
const dots = [...cell(6, [1, 3, 4]), ...cell(28, [2, 4, 5, 6])];

/** Favicon: filled dots only, so the mark reads at 16 px. */
function markSvg({ fill, background, pad }) {
  const size = 44 + pad * 2;
  const circles = dots
    .filter((d) => d.on)
    .map((d) => `<circle cx="${d.cx + pad}" cy="${d.cy + pad + 7}" r="4.2" fill="${fill}"/>`)
    .join("");
  const bg = background
    ? `<rect width="${size}" height="${size}" rx="${pad}" fill="${background}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${bg}${circles}</svg>`;
}

// The SVG favicon follows the visitor's color scheme on its own.
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44">
<style>circle{fill:${INK}}@media (prefers-color-scheme:dark){circle{fill:${LAMP}}}</style>
${dots
  .filter((d) => d.on)
  .map((d) => `<circle cx="${d.cx}" cy="${d.cy + 7}" r="4.2"/>`)
  .join("\n")}
</svg>
`;
writeFileSync("public/favicon.svg", svgFavicon);

const render = async (svg, size, file) => {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/${file}`);
  console.log(`wrote public/${file}`);
};

await render(markSvg({ fill: INK, background: PAPER, pad: 4 }), 32, "favicon-32.png");
await render(markSvg({ fill: LAMP, background: INK, pad: 8 }), 180, "apple-touch-icon.png");
await render(markSvg({ fill: LAMP, background: INK, pad: 8 }), 192, "icon-192.png");
await render(markSvg({ fill: LAMP, background: INK, pad: 8 }), 512, "icon-512.png");

writeFileSync(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Michael Walsh",
      short_name: "mjwalsh",
      description: "Michael Walsh, developer, writer, blind since 34.",
      start_url: "/",
      display: "browser",
      background_color: INK,
      theme_color: INK,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log("wrote public/site.webmanifest");
