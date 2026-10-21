// Renders one social card to the scratch folder for a visual check:
// npx tsx scripts/og-preview.ts "Title" out.png
import { writeFileSync } from "node:fs";
import { renderOgPng, renderOgSvg } from "../src/lib/og/render";

const title = process.argv[2] ?? "Accessibility statement";
const out = process.argv[3] ?? "og-preview.png";
const input = { title, eyebrow: "Accessibility", meta: "Updated 2026-10-21" };
const svg = await renderOgSvg(input);
console.log(
  "svg bytes",
  svg.length,
  "mentions mjwalsh.net:",
  svg.includes("mjwalsh") ? "yes" : "text is paths",
);
writeFileSync(out, await renderOgPng(input));
console.log("wrote", out);
