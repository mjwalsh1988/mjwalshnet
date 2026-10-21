import type { APIRoute } from "astro";
import { feedItems, jsonFeed } from "../lib/feeds";
import { STATIC_PAGES } from "../lib/pages";
import { SITE } from "../lib/site";

export const GET: APIRoute = async () => {
  const items = await feedItems();
  const feed = jsonFeed(items, {
    title: `${SITE.name}, all posts`,
    path: "/blog",
    feedPath: "/feed.json",
    description: STATIC_PAGES.blog.description,
  });
  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
};
