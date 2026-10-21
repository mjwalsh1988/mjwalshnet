// Copies Michael's memoir draft into the story collection unchanged except for
// straight quotes and Markdown section headings. Run once:
//   node scripts/import-memoir.mjs "C:\Users\mjwal\OneDrive\Desktop\my-story.txt"
// Never edit the chapter text by hand after this; edit the draft and rerun.
import { readFileSync, writeFileSync } from "node:fs";

const source = process.argv[2];
if (!source) throw new Error("pass the path to the draft");
const raw = readFileSync(source, "utf8")
  .replace(/\r\n/g, "\n")
  .replace(/^\uFEFF/, "");

const straight = (s) =>
  s
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...");

const blocks = raw
  .split(/\n{2,}/)
  .map((b) => b.trim())
  .filter(Boolean);

const title = straight(blocks.shift());
// A short line with no sentence punctuation is one of his section headings.
const isHeading = (b) => b.length < 60 && !/[.!?,"]$/.test(b) && !b.includes("\n");

const body = blocks.map((b) => (isHeading(b) ? `## ${straight(b)}` : straight(b))).join("\n\n");

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
chapter: 1
summary: "[MICHAEL: one line that says what chapter one covers, for the chapter rail]"
period: "[MICHAEL: the months or years chapter one covers, for example 2021 to 2022]"
date: 2026-10-21
description: "[MICHAEL: a description of 120 to 160 characters for search results and social cards]"
draft: false
---

{/* Imported from the draft by scripts/import-memoir.mjs. Edit the draft, not this file. */}

`;

const out = "src/content/story/01-through-darkness-and-light.mdx";
writeFileSync(out, frontmatter + body + "\n");
console.log(`wrote ${out}: ${blocks.length} blocks, ${body.split(/\s+/).length} words`);
