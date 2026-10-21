import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { feedItems } from "../../../../lib/feeds";
import { SITE } from "../../../../lib/site";
import { CATEGORIES, categoryBySlug, categoryPath } from "../../../../lib/taxonomy";

export function getStaticPaths() {
  return CATEGORIES.map((c) => ({ params: { category: c.slug } }));
}

export const GET: APIRoute = async (context) => {
  const slug = context.params.category!;
  const category = categoryBySlug(slug);
  const items = await feedItems(slug);
  const description = category.description.startsWith("[MICHAEL")
    ? `Posts in ${category.name} on mjwalsh.net.`
    : category.description;
  return rss({
    title: `${SITE.name}, ${category.name}`,
    description,
    site: new URL(categoryPath(slug), context.site ?? SITE.url).toString(),
    stylesheet: "/feed.xsl",
    trailingSlash: false,
    xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
    customData: `<language>${SITE.language}</language>`,
    items: items.map((item) => ({
      title: item.title,
      link: item.url,
      description: item.description,
      pubDate: item.date,
      categories: [item.category, ...item.tags],
      content: item.html,
    })),
  });
};
