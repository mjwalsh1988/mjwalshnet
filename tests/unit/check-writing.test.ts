import { describe, expect, it } from "vitest";
import {
  checkLine,
  checkSource,
  placeholdersIn,
  proseFromAstro,
  proseFromMarkdown,
} from "../../scripts/check-writing";

const rules = (text: string) => checkLine(text).map((h) => h.rule);

describe("checkLine", () => {
  it("passes plain copy", () => {
    expect(rules("I was 34 years old when I lost my sight to a brain tumor.")).toEqual([]);
    expect(rules("Email me")).toEqual([]);
  });
  it("flags em dashes, curly quotes and ellipsis characters", () => {
    expect(rules("one — two")).toContain("em dash");
    expect(rules("it’s")).toContain("curly quote");
    expect(rules("wait…")).toContain("ellipsis character");
  });
  it("flags emoji", () => {
    expect(rules("Ship it \u{1F680}")).toContain("emoji");
  });
  it("flags banned words on word boundaries only", () => {
    expect(rules("A seamless experience")).toContain("banned word");
    expect(rules("We leverage tools")).toContain("banned word");
    expect(rules("The realm of possibility")).toContain("banned word");
    expect(rules("robustness is not the word here")).toEqual([]);
  });
  it("flags negative parallelism", () => {
    expect(rules("It's not just a tool, it's a workflow.")).toContain("negative parallelism");
    expect(rules("More than a blog, it is a record.")).toContain("negative parallelism");
    expect(rules("I did not only the front end but the whole stack.")).toContain(
      "negative parallelism",
    );
  });
  it("flags formulaic transitions at sentence starts", () => {
    expect(rules("Moreover, the site is fast.")).toContain("formulaic transition");
    expect(rules("The site is fast. Ultimately it works.")).toContain("formulaic transition");
    expect(rules("I will do that additionally to the rest.")).toEqual([]);
  });
  it("flags vague authority and inflation", () => {
    expect(rules("Studies show this works.")).toContain("vague authority");
    expect(rules("It is a testament to hard work.")).toContain("banned word");
    expect(rules("Reflecting a broader shift toward remote work")).toContain(
      "significance inflation",
    );
  });
  it("flags Title Case headings in markdown unless allowed", () => {
    expect(rules("## How I Write Code I Cannot See")).toContain("Title Case heading");
    expect(rules("## How I write code I cannot see")).toEqual([]);
    expect(checkLine("## The First Sign", { allowTitleCase: true })).toEqual([]);
    expect(rules("## NVDA and JAWS")).toEqual([]);
  });
});

describe("proseFromMarkdown", () => {
  it("skips fenced code and imports, keeps frontmatter values", () => {
    const md = [
      "---",
      "title: A seamless title",
      "---",
      "import X from './x';",
      "",
      "```ts",
      "const seamless = 1;",
      "```",
      "",
      "Body `inline seamless` text.",
    ].join("\n");
    const segs = proseFromMarkdown(md);
    expect(segs.map((s) => s.text)).toEqual(["A seamless title", "", "", "Body   text."]);
    expect(checkSource("post.md", md).map((f) => f.line)).toEqual([2]);
  });
  it("keeps alt and aria-label from JSX tags", () => {
    const md = '<img src="x.png" alt="A seamless photo" />';
    expect(checkSource("post.mdx", md)).toHaveLength(1);
  });
});

describe("proseFromAstro", () => {
  const astro = [
    "---",
    'const label = "Email me";',
    "// leverage nothing here",
    "---",
    '<button aria-label="Open the robust menu" class="transform">Menu</button>',
    "<style>",
    "  .x { transform: none; }",
    "</style>",
    "<p>Plain text</p>",
  ].join("\n");
  it("checks frontmatter comments and copy attributes but not class names or style blocks", () => {
    const findings = checkSource("page.astro", astro);
    expect(findings.map((f) => [f.line, f.rule])).toEqual([
      [3, "banned word"],
      [5, "banned word"],
    ]);
  });
  it("honours ignore-next-line", () => {
    const src = ["<!-- writing-check: ignore-next-line -->", "<p>A robust line</p>"].join("\n");
    expect(checkSource("page.astro", src)).toEqual([]);
    expect(proseFromAstro(src).length).toBeGreaterThan(0);
  });
});

describe("placeholdersIn", () => {
  it("lists MICHAEL placeholders with their line numbers", () => {
    const src = "a\n[MICHAEL: what you did at Hostgator]\n[MICHAEL: a photo]";
    expect(placeholdersIn("x.mdx", src)).toEqual([
      { file: "x.mdx", line: 2, text: "what you did at Hostgator" },
      { file: "x.mdx", line: 3, text: "a photo" },
    ]);
  });
});
