// Feed helpers (section 10.4): full-content RSS and JSON Feed for the blog and
// per category. Post bodies are rendered to HTML through Astro's container so
// the feed carries the same content as the page.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer as mdxRenderer } from "@astrojs/mdx/container-renderer";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { mdxComponents } from "../components/content/mdx-components";
import { getPosts, includeDrafts, postPath, type Post } from "./content";
import { canonicalUrl } from "./seo/meta";
import { SITE } from "./site";
import { categoryBySlug } from "./taxonomy";

let containerPromise: Promise<AstroContainer> | undefined;
function container(): Promise<AstroContainer> {
  if (!containerPromise) {
    containerPromise = loadRenderers([mdxRenderer()]).then((renderers) =>
      AstroContainer.create({ renderers }),
    );
  }
  return containerPromise;
}

export async function postHtml(post: Post): Promise<string> {
  const { Content } = await render(post);
  const c = await container();
  const html = await c.renderToString(Content, {
    partial: true,
    props: { components: mdxComponents },
  });
  // Make relative links absolute for feed readers.
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${SITE.url}/`);
}

export type FeedItem = {
  title: string;
  url: string;
  description: string;
  date: Date;
  updated?: Date;
  category: string;
  tags: string[];
  html: string;
};

export async function feedItems(categorySlug?: string, limit = 30): Promise<FeedItem[]> {
  // Drafts appear in feeds only in builds that include drafts (dev and the test build).
  const drafts = includeDrafts();
  const posts = (await getPosts()).filter(
    (p) => (drafts || !p.data.draft) && (!categorySlug || p.data.category === categorySlug),
  );
  const items: FeedItem[] = [];
  for (const post of posts.slice(0, limit)) {
    items.push({
      title: post.data.title,
      url: canonicalUrl(postPath(post)),
      description: post.data.description,
      date: post.data.date,
      updated: post.data.updated,
      category: categoryBySlug(post.data.category).name,
      tags: post.data.tags,
      html: await postHtml(post),
    });
  }
  return items;
}

export function jsonFeed(
  items: FeedItem[],
  options: { title: string; path: string; feedPath: string; description: string },
) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: options.title,
    home_page_url: canonicalUrl(options.path),
    feed_url: canonicalUrl(options.feedPath),
    description: options.description,
    language: SITE.language,
    authors: [{ name: "Michael Walsh", url: SITE.url }],
    items: items.map((item) => ({
      id: item.url,
      url: item.url,
      title: item.title,
      summary: item.description,
      content_html: item.html,
      date_published: item.date.toISOString(),
      ...(item.updated ? { date_modified: item.updated.toISOString() } : {}),
      tags: [item.category, ...item.tags],
      authors: [{ name: "Michael Walsh", url: SITE.url }],
    })),
  };
}
