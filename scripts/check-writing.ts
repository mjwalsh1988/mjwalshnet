// Writing pattern checker. Scans site copy (Markdown, MDX, Astro templates,
// TypeScript strings and comments) for the patterns the house style bans and
// fails when it finds one. Run with `npm run check:writing`; it also runs in CI
// and before every commit.
//
// Rules are in docs/mjwalsh-net-build-plan.md section 7.3. This file is the
// one place allowed to contain the banned words, because it has to list them.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export type Finding = {
  file: string;
  line: number;
  rule: string;
  excerpt: string;
};

export type CheckOptions = {
  /** Skip the Title Case heading rule (used for the memoir, whose headings are Michael's own). */
  allowTitleCase?: boolean;
};

const BANNED_WORDS = [
  "seamless",
  "seamlessly",
  "robust",
  "cutting-edge",
  "state-of-the-art",
  "stunning",
  "breathtaking",
  "unparalleled",
  "game-changing",
  "game-changer",
  "game changer",
  "elevate",
  "elevates",
  "elevating",
  "unlock",
  "unlocks",
  "unlocking",
  "harness",
  "harnessing",
  "leverage",
  "leverages",
  "leveraging",
  "empower",
  "empowers",
  "empowering",
  "streamline",
  "streamlines",
  "streamlining",
  "transform",
  "transforms",
  "transformative",
  "revolutionize",
  "revolutionizes",
  "revolutionary",
  "delve",
  "delves",
  "delving",
  "tapestry",
  "testament",
  "landscape",
  "realm",
  "spearhead",
  "spearheaded",
  "drive innovation",
  "driving innovation",
];

const TRANSITIONS = [
  "in summary",
  "overall,",
  "ultimately",
  "moreover",
  "furthermore",
  "additionally",
  "that said",
  "it's worth noting",
  "it is worth noting",
  "when it comes to",
  "in today's world",
  "in today's fast-paced",
  "let's dive in",
  "in conclusion",
  "in an era where",
  "in an age where",
];

const VAGUE_AUTHORITY = [
  "experts agree",
  "experts say",
  "studies show",
  "research shows",
  "many users find",
  "it is widely considered",
  "widely regarded",
  "it is well known that",
];

const INFLATION = [
  "underscoring",
  "underscores the importance",
  "underscore the importance",
  "reflecting a broader",
  "broader shift",
  "highlighting the importance",
  "highlights the importance",
  "a testament to",
  "stands as a",
  "serves as a reminder",
];

const SCAFFOLDING = [
  "i hope this helps",
  "let me know if",
  "here's what you need to know",
  "here is what you need to know",
  "great question",
  "without further ado",
];

const SMALL_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "by",
  "with",
  "from",
  "as",
  "vs",
  "is",
  "it",
  "my",
  "i",
]);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phraseRegExp = (phrases: string[]) =>
  new RegExp(`(?<![\\w-])(${phrases.map(escapeRegExp).join("|")})(?![\\w-])`, "i");

const bannedWordRe = phraseRegExp(BANNED_WORDS);
const transitionRe = new RegExp(
  `(^|[.!?]\\s+|["'(]\\s*)(${TRANSITIONS.map(escapeRegExp).join("|")})(?![\\w-])`,
  "i",
);
const vagueRe = phraseRegExp(VAGUE_AUTHORITY);
const inflationRe = phraseRegExp(INFLATION);
const scaffoldingRe = phraseRegExp(SCAFFOLDING);
const negativeParallelRe =
  /\b(not|isn't|aren't|wasn't|weren't|is not|are not|was not|were not)\s+(just|only|merely|simply)\b/i;
const moreThanRe =
  /\bmore than (just )?(a|an|the)\b[^.;:]{0,60},\s*(it|this|that|he|she|they|we|i)\b/i;
// Extended_Pictographic covers emoji; the variation selector and ZWJ catch sequences.
const emojiRe = /\p{Extended_Pictographic}|‍|️/u;
const emDashRe = /—/;
const curlyRe = /[‘’“”]/;
const ellipsisRe = /…/;
const IGNORE_NEXT = "writing-check: ignore-next-line";
const IGNORE_FILE = "writing-check: ignore-file";

function excerptOf(line: string, match: RegExpMatchArray | null): string {
  const trimmed = line.trim();
  if (!match || match.index === undefined) return trimmed.slice(0, 120);
  const start = Math.max(0, match.index - 40);
  return line.slice(start, match.index + match[0].length + 40).trim();
}

function isTitleCase(heading: string): boolean {
  const words = heading
    .replace(/[`*_~]/g, "")
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w));
  if (words.length < 3) return false;
  const significant = words.slice(1).filter((w) => !SMALL_WORDS.has(w.toLowerCase()));
  if (significant.length < 2) return false;
  // Title Case: every significant word after the first starts with a capital
  // and at least one of them is an ordinary lowercase-able word, so a heading
  // made only of acronyms and names (NVDA and JAWS) passes.
  const allCapitalised = significant.every((w) => /^[A-Z]/.test(w));
  const hasOrdinaryWord = significant.some((w) => /^[A-Z][a-z]+$/.test(w) && w.length > 3);
  return allCapitalised && hasOrdinaryWord;
}

/** Check one line of prose and return the rules that fire. */
export function checkLine(
  line: string,
  opts: CheckOptions = {},
): { rule: string; match: RegExpMatchArray | null }[] {
  const hits: { rule: string; match: RegExpMatchArray | null }[] = [];
  const test = (rule: string, re: RegExp) => {
    const m = line.match(re);
    if (m) hits.push({ rule, match: m });
  };
  test("em dash", emDashRe);
  test("curly quote", curlyRe);
  test("ellipsis character", ellipsisRe);
  test("emoji", emojiRe);
  test("banned word", bannedWordRe);
  test("formulaic transition", transitionRe);
  test("vague authority", vagueRe);
  test("significance inflation", inflationRe);
  test("conversational scaffolding", scaffoldingRe);
  test("negative parallelism", negativeParallelRe);
  test("negative parallelism", moreThanRe);
  const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
  if (heading && heading[1] && !opts.allowTitleCase && isTitleCase(heading[1])) {
    hits.push({ rule: "Title Case heading", match: heading });
  }
  return hits;
}

type Segment = { line: number; text: string };

/** Pull the prose out of a Markdown or MDX file: everything except fenced code, inline code, imports and JSX tags. */
export function proseFromMarkdown(source: string): Segment[] {
  const out: Segment[] = [];
  const lines = source.split(/\r?\n/);
  let inFence = false;
  let inFrontmatter = false;
  lines.forEach((raw, i) => {
    const line = raw;
    if (i === 0 && line.trim() === "---") {
      inFrontmatter = true;
      return;
    }
    if (inFrontmatter) {
      if (line.trim() === "---") inFrontmatter = false;
      else {
        // Frontmatter values are copy too (title, description, alt text).
        const value = line.replace(/^\s*[\w-]+:\s*/, "").replace(/^-\s+/, "");
        out.push({ line: i + 1, text: value.replace(/^["']|["']$/g, "") });
      }
      return;
    }
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    if (/^\s*(import|export)\s/.test(line)) return;
    let text = line.replace(/`[^`]*`/g, " ");
    // Keep attribute copy from JSX tags (alt, title, aria-label) and drop the rest of the tag.
    text = text.replace(/<[^>]*>/g, (tag) => {
      const attrs = [
        ...tag.matchAll(
          /\b(alt|title|aria-label|aria-description|label|summary|caption|placeholder)=["']([^"']*)["']/g,
        ),
      ];
      return attrs.map((m) => m[2]).join(" ");
    });
    out.push({ line: i + 1, text });
  });
  return out;
}

const COPY_ATTRS =
  /\b(alt|title|aria-label|aria-description|aria-roledescription|label|placeholder|content|summary|caption|data-copy)=(["'])(.*?)\2/g;

/** Pull copy out of an Astro file: template text, copy-bearing attributes, and frontmatter strings and comments. */
export function proseFromAstro(source: string): Segment[] {
  const out: Segment[] = [];
  const lines = source.split(/\r?\n/);
  let fences = 0;
  let inStyle = false;
  let inScript = false;
  lines.forEach((raw, i) => {
    const n = i + 1;
    if (raw.trim() === "---" && fences < 2) {
      fences += 1;
      return;
    }
    if (fences === 1) {
      out.push(...proseFromCodeLine(raw, n));
      return;
    }
    if (/<style[\s>]/.test(raw)) inStyle = true;
    if (/<script[\s>]/.test(raw)) inScript = true;
    if (inStyle || inScript) {
      if (inScript) out.push(...proseFromCodeLine(raw.replace(/<\/?script[^>]*>/g, ""), n));
      if (/<\/style>/.test(raw)) inStyle = false;
      if (/<\/script>/.test(raw)) inScript = false;
      return;
    }
    const attrCopy = [...raw.matchAll(COPY_ATTRS)].map((m) => m[3] ?? "");
    // Expressions in braces are code; strings inside them are copy.
    const exprStrings: string[] = [];
    const withoutExpr = raw.replace(/\{[^{}]*\}/g, (expr) => {
      exprStrings.push(...stringLiterals(expr));
      return " ";
    });
    const text = withoutExpr.replace(/<[^>]*>/g, " ").replace(/<!--.*?-->/g, " ");
    const comment = raw.match(/<!--(.*?)-->/);
    const pieces = [text, ...attrCopy, ...exprStrings, comment?.[1] ?? ""].filter((p) => p.trim());
    if (pieces.length) out.push({ line: n, text: pieces.join(" ") });
  });
  return out;
}

function stringLiterals(code: string): string[] {
  const found: string[] = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  for (const m of code.matchAll(re)) {
    const value = m[1] ?? m[2] ?? m[3] ?? "";
    // Skip paths, imports, class lists and identifiers: copy has a space or ends a sentence.
    if (/\s/.test(value) || /[.!?]$/.test(value)) found.push(value);
  }
  return found;
}

function proseFromCodeLine(line: string, n: number): Segment[] {
  if (/^\s*(import|export \* from|export \{)/.test(line)) return [];
  const pieces: string[] = [];
  const comment =
    line.match(/(?:^|\s)\/\/\s?(.*)$/) ??
    line.match(/^\s*\*\s?(.*)$/) ??
    line.match(/\/\*\*?\s?(.*?)\s*(\*\/)?$/);
  if (comment?.[1]) pieces.push(comment[1]);
  pieces.push(...stringLiterals(line.replace(/\/\/.*$/, "")));
  return pieces.length ? [{ line: n, text: pieces.join(" ") }] : [];
}

/** Pull copy out of a TypeScript or JavaScript file: comments and string literals. */
export function proseFromCode(source: string): Segment[] {
  const out: Segment[] = [];
  source.split(/\r?\n/).forEach((line, i) => out.push(...proseFromCodeLine(line, i + 1)));
  return out;
}

export function checkSource(file: string, source: string, opts: CheckOptions = {}): Finding[] {
  if (source.includes(IGNORE_FILE)) return [];
  const ext = path.extname(file).toLowerCase();
  let segments: Segment[];
  if (ext === ".md" || ext === ".mdx") segments = proseFromMarkdown(source);
  else if (ext === ".astro") segments = proseFromAstro(source);
  else segments = proseFromCode(source);
  const lines = source.split(/\r?\n/);
  const findings: Finding[] = [];
  for (const seg of segments) {
    const previous = lines[seg.line - 2] ?? "";
    if (previous.includes(IGNORE_NEXT)) continue;
    for (const hit of checkLine(seg.text, opts)) {
      findings.push({
        file,
        line: seg.line,
        rule: hit.rule,
        excerpt: excerptOf(seg.text, hit.match),
      });
    }
  }
  return findings;
}

const SCAN_EXTENSIONS = new Set([".md", ".mdx", ".astro", ".ts", ".tsx", ".mjs", ".js", ".json"]);
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".astro",
  ".vercel",
  ".git",
  "types",
  "test-results",
  "playwright-report",
]);
const SELF = ["scripts/check-writing.ts", "tests/unit/check-writing.test.ts"];

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (SCAN_EXTENSIONS.has(path.extname(entry).toLowerCase())) files.push(full);
  }
  return files;
}

export function optionsForFile(file: string): CheckOptions {
  const normalized = file.split(path.sep).join("/");
  // The memoir chapters are Michael's own words; his section headings are his style.
  return { allowTitleCase: normalized.includes("src/content/story/") };
}

export function placeholdersIn(
  file: string,
  source: string,
): { file: string; line: number; text: string }[] {
  const out: { file: string; line: number; text: string }[] = [];
  source.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/\[MICHAEL:\s*([^\]]+)\]/g)) {
      out.push({ file, line: i + 1, text: m[1]?.trim() ?? "" });
    }
  });
  return out;
}

export function run(roots: string[], mode: "check" | "placeholders" = "check"): number {
  const files = roots.flatMap((r) => (statSync(r).isDirectory() ? walk(r) : [r]));
  if (mode === "placeholders") {
    let count = 0;
    for (const file of files) {
      const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
      for (const p of placeholdersIn(rel, readFileSync(file, "utf8"))) {
        count += 1;
        console.log(`${p.file}:${p.line}: ${p.text}`);
      }
    }
    console.log(`${count} placeholder${count === 1 ? "" : "s"} waiting for Michael's words.`);
    return 0;
  }
  const findings: Finding[] = [];
  for (const file of files) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
    if (SELF.includes(rel)) continue;
    findings.push(...checkSource(rel, readFileSync(file, "utf8"), optionsForFile(rel)));
  }
  for (const f of findings) console.log(`${f.file}:${f.line}: ${f.rule}: ${f.excerpt}`);
  if (findings.length) {
    console.log(
      `\nWriting check: ${findings.length} finding${findings.length === 1 ? "" : "s"} in ${files.length} files.`,
    );
    return 1;
  }
  console.log(`Writing check: no findings in ${files.length} files.`);
  return 0;
}

const entry = process.argv[1] ? path.resolve(process.argv[1]) : "";
const self = path.resolve(
  decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"),
);
if (entry && entry === self) {
  const args = process.argv.slice(2);
  const mode = args.includes("--placeholders") ? "placeholders" : "check";
  const roots = args.filter((a) => !a.startsWith("--"));
  const defaults = [
    "src",
    "scripts",
    "tests",
    "docs/progress.md",
    "docs/handoff.md",
    "README.md",
    ".github",
  ].filter((p) => {
    try {
      statSync(p);
      return true;
    } catch {
      return false;
    }
  });
  process.exitCode = run(roots.length ? roots : defaults, mode);
}
