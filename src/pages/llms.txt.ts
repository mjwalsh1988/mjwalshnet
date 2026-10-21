// llms.txt (section 10.4): the main pages and feeds in plain text for the AI
// crawlers that read it. Five minutes of effort by design.
import type { APIRoute } from "astro";
import { getPosts, postPath } from "../lib/content";
import { STATIC_PAGE_LIST } from "../lib/pages";
import { canonicalUrl } from "../lib/seo/meta";
import { SITE } from "../lib/site";
import { CATEGORIES, categoryPath } from "../lib/taxonomy";

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "Every word on this site was written or edited by Michael Walsh. The page at /colophon explains how it is built and which tools were used.",
    "",
    "## Pages",
    "",
    ...STATIC_PAGE_LIST.map((p) => `- [${p.title}](${canonicalUrl(p.path)}): ${p.description}`),
    "",
    "## Blog categories",
    "",
    ...CATEGORIES.map((c) => `- [${c.name}](${canonicalUrl(categoryPath(c.slug))})`),
    "",
    "## Posts",
    "",
    ...posts.map((p) => `- [${p.data.title}](${canonicalUrl(postPath(p))}): ${p.data.description}`),
    "",
    "## Feeds and data",
    "",
    `- RSS: ${canonicalUrl("/feed.xml")}`,
    `- JSON Feed: ${canonicalUrl("/feed.json")}`,
    `- Sitemap: ${canonicalUrl("/sitemap-index.xml")}`,
    `- Resume as JSON Resume: ${canonicalUrl("/resume.json")}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
