// Writes the launch content skeleton from section 7.4 of the plan: one draft
// post per planned title with a placeholder body, the five project pages, and
// the first now entry. Every file it writes is a draft except the memoir
// chapter, which scripts/import-memoir.mjs owns. Safe to rerun: it never
// overwrites a file that already exists.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const DATE = "2026-10-21";

const posts = [
  {
    slug: "the-day-i-called-my-first-uber",
    title: "The day I called my first Uber",
    category: "traversing-darkness",
    series: "traversing-darkness-notes",
    tags: ["sight-loss", "driving"],
  },
  {
    slug: "what-i-wish-the-ophthalmologist-had-said",
    title: "What I wish the ophthalmologist had said",
    category: "traversing-darkness",
    tags: ["sight-loss", "doctors"],
  },
  {
    slug: "how-i-write-code-i-cannot-see",
    title: "How I write code I cannot see",
    category: "building-blind",
    tags: ["nvda", "claude-code", "workflow"],
    summary: true,
  },
  {
    slug: "my-screen-reader-setup-in-2026",
    title: "My screen reader setup in 2026",
    category: "building-blind",
    tags: ["nvda", "setup"],
    summary: true,
  },
  {
    slug: "life-post-one",
    title: "[MICHAEL: title of a short Life post, your choice of subject]",
    category: "life",
    tags: ["fort-wayne"],
  },
  {
    slug: "using-claude-as-a-logged-step",
    title: "Using Claude as a logged step, not a magic box",
    category: "ai-and-automation",
    tags: ["claude", "automation", "supabase"],
    summary: true,
  },
  {
    slug: "twenty-five-pipelines-one-credit-card",
    title: "Twenty-five pipelines, one personal credit card: how FF Beacon runs itself",
    category: "ai-and-automation",
    tags: ["ff-beacon", "automation", "vercel"],
    summary: true,
  },
  {
    slug: "seven-years-running-a-hosting-company",
    title: "Seven years running a hosting company, and what it taught me about uptime",
    category: "programming",
    tags: ["hoststing", "linux", "hosting"],
    summary: true,
  },
  {
    slug: "what-69885-impressions-taught-me",
    title: "What 69,885 impressions in 90 days taught me about writing for search",
    category: "seo-and-marketing",
    tags: ["search-console", "ff-beacon", "seo"],
    summary: true,
    note: "The number in the title is re-pulled from Search Console before publishing (section 7.4).",
  },
  {
    slug: "twenty-seasons-of-playing-by-ear",
    title: "Twenty seasons of playing by ear",
    category: "fantasy-football",
    tags: ["dynasty", "sleeper", "ff-beacon"],
  },
  {
    slug: "packers-launch-week",
    title: "[MICHAEL: Packers post for launch week, whatever the Packers just did]",
    category: "packers-and-the-nfl",
    tags: ["packers"],
  },
  ...[1, 2, 3, 4, 5].map((n) => ({
    slug: `build-log-${n}`,
    title: `[MICHAEL: Build Log entry ${n}: what shipped, in one line]`,
    category: "build-log",
    tags: ["build-log"],
    note: "Backdated to the real event once you confirm the date (section 7.4).",
  })),
];

function postFile(p) {
  const series = p.series ? `series: ${p.series}\nseriesOrder: 1\n` : "";
  const tags = p.tags.map((t) => `"${t}"`).join(", ");
  const summary = p.summary
    ? `
<Callout kind="summary">
  [MICHAEL: two or three plain sentences that say what this post is about and what a reader will get from it]
</Callout>
`
    : "";
  const note = p.note ? `\n{/* ${p.note} */}\n` : "";
  return `---
title: "${p.title.replace(/"/g, '\\"')}"
description: "[MICHAEL: 120 to 160 characters describing this post, for search results and cards]"
date: ${DATE}
category: ${p.category}
${series}tags: [${tags}]
draft: true
---
${note}${summary}
[MICHAEL: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.]
`;
}

const projects = [
  {
    slug: "ff-beacon",
    order: 1,
    title: "FF Beacon",
    tagline: "[MICHAEL: one line on what FF Beacon is, for the projects grid]",
    url: "https://ffbeacon.com",
    role: ["Founder", "Designer", "Developer"],
    year: "[MICHAEL: year started] to present",
    status: "live",
    stack: [
      ["Next.js", "[MICHAEL: what it does in FF Beacon]"],
      ["Supabase", "[MICHAEL: what it does in FF Beacon]"],
      ["Vercel", "[MICHAEL: hosting, cron, functions]"],
    ],
    stats: [
      {
        value: "69,885",
        label: "Search Console impressions, last 90 days",
        source: "Google Search Console, re-pulled before publishing",
        asOf: DATE,
        metricKey: "ffbeacon_gsc_impressions_90d",
      },
    ],
  },
  {
    slug: "gridiron-sites",
    order: 2,
    title: "Gridiron Sites",
    tagline: "[MICHAEL: one line on what Gridiron Sites is]",
    url: "https://gridironsites.com",
    role: ["Founder", "Developer"],
    year: "[MICHAEL: year started] to present",
    status: "live",
    stack: [["Next.js", "[MICHAEL: what it does here]"]],
    stats: [],
  },
  {
    slug: "dynasty-price-check",
    order: 3,
    title: "Dynasty Price Check",
    tagline: "[MICHAEL: one line on what Dynasty Price Check does]",
    url: "https://gridironsites.com",
    role: ["Developer"],
    year: "[MICHAEL: year]",
    status: "live",
    stack: [],
    stats: [],
  },
  {
    slug: "hoststing",
    order: 4,
    title: "Hoststing LLC",
    tagline: "A Linux web hosting company I founded, ran for seven years, and sold.",
    role: ["Founder", "Chief Executive Officer"],
    year: "2015 to 2022",
    status: "sold",
    stack: [["Linux", "[MICHAEL: the platform, in a few words]"]],
    stats: [],
  },
  {
    slug: "mjwalsh-net",
    order: 5,
    title: "mjwalsh.net",
    tagline:
      "This site: a personal site built by a blind developer, with the construction as content.",
    url: "https://mjwalsh.net",
    role: ["Designer", "Developer", "Writer"],
    year: "2026 to present",
    status: "this site",
    stack: [
      ["Astro", "Static pages, content collections, the image and font pipelines"],
      ["Supabase", "Live metrics, contact form backup, newsletter mirror"],
      ["Vercel", "Hosting, the two functions, the nightly metrics cron"],
      ["Resend", "Contact form mail"],
      ["Google Analytics 4", "Traffic, loaded after the page is interactive"],
    ],
    stats: [],
  },
];

function projectFile(p) {
  const yaml = (arr) => (arr.length ? arr : null);
  const stack = yaml(p.stack)
    ? p.stack.map(([name, use]) => `  - name: "${name}"\n    use: "${use}"`).join("\n")
    : "";
  const stats = yaml(p.stats)
    ? p.stats
        .map(
          (s) =>
            `  - value: "${s.value}"\n    label: "${s.label}"\n    source: "${s.source}"\n    asOf: ${s.asOf}${s.metricKey ? `\n    metricKey: ${s.metricKey}` : ""}`,
        )
        .join("\n")
    : "";
  return `---
title: "${p.title}"
description: "[MICHAEL: 120 to 160 characters describing ${p.title}, for search results and cards]"
tagline: "${p.tagline}"
${p.url ? `url: ${p.url}\n` : ""}role: [${p.role.map((r) => `"${r}"`).join(", ")}]
year: "${p.year}"
order: ${p.order}
status: ${p.status}
stack:${stack ? `\n${stack}` : " []"}
stats:${stats ? `\n${stats}` : " []"}
gallery: []
draft: ${p.slug === "mjwalsh-net" || p.slug === "hoststing" ? "false" : "true"}
---

## The problem

[MICHAEL: what problem ${p.title} set out to solve, in your words]

## What I built

[MICHAEL: what you built and how, with the decisions that mattered]

## What I learned

[MICHAEL: what worked, what did not, and what you would do differently]
`;
}

const nowFile = `---
month: 2026-10-01
draft: true
---

## Working on

[MICHAEL: what you are building this month]

## Reading and listening to

[MICHAEL: books, podcasts, audio]

## Changed since last month

[MICHAEL: the dated changelog line for this month]
`;

let written = 0;
const write = (file, content) => {
  if (existsSync(file)) return;
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
  written += 1;
  console.log(`wrote ${file}`);
};

for (const p of posts) write(`src/content/posts/${p.slug}/index.mdx`, postFile(p));
for (const p of projects) write(`src/content/projects/${p.slug}/index.mdx`, projectFile(p));
write("src/content/now/2026-10.mdx", nowFile);
console.log(`${written} files written`);
