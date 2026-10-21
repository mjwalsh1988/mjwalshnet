import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { feedItems } from "../lib/feeds";
import { STATIC_PAGES } from "../lib/pages";
import { SITE } from "../lib/site";

export const GET: APIRoute = async (context) => {
  const items = await feedItems();
  return rss({
    title: `${SITE.name}, all posts`,
    description: STATIC_PAGES.blog.description,
    site: context.site ?? SITE.url,
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
