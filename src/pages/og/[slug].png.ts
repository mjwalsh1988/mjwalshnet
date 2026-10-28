// One social image per page, generated at build. The slug is the page path
// with slashes turned into double hyphens (see ogImageUrl in lib/seo/meta.ts);
// the home page is "home".
import type { APIRoute, GetStaticPaths } from "astro";
import {
  chapterPath,
  formatDate,
  getChapters,
  getPosts,
  getProjects,
  postPath,
  postReadingTime,
  projectPath,
} from "../../lib/content";
import { renderOgPng, type OgInput } from "../../lib/og/render";
import { ogSlug } from "../../lib/seo/meta";
import { STATIC_PAGE_LIST } from "../../lib/pages";
import { categoryBySlug, CATEGORIES, categoryPath } from "../../lib/taxonomy";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries: { slug: string; input: OgInput }[] = STATIC_PAGE_LIST.map((page) => ({
    slug: ogSlug(page.path),
    input: {
      title: page.ogTitle ?? page.title,
      eyebrow: page.eyebrow,
      meta: page.ogMeta,
      ground: page.ground ?? "paper",
    },
  }));
  for (const post of await getPosts()) {
    entries.push({
      slug: ogSlug(postPath(post)),
      input: {
        title: post.data.title,
        eyebrow: categoryBySlug(post.data.category).name,
        meta: `${formatDate(post.data.date)}, ${postReadingTime(post).label}`,
        ground: post.data.category === "traversing-darkness" ? "ink" : "paper",
      },
    });
  }
  for (const project of await getProjects()) {
    entries.push({
      slug: ogSlug(projectPath(project)),
      input: { title: project.data.title, eyebrow: "Project", meta: project.data.year },
    });
  }
  for (const chapter of await getChapters()) {
    entries.push({
      slug: ogSlug(chapterPath(chapter)),
      input: {
        title: chapter.data.title,
        eyebrow: `Chapter ${chapter.data.chapter}`,
        meta: "Traversing Darkness",
        ground: "ink",
      },
    });
  }
  for (const category of CATEGORIES) {
    entries.push({
      slug: ogSlug(categoryPath(category.slug)),
      input: { title: category.name, eyebrow: "Blog category" },
    });
  }
  return entries.map((e) => ({ params: { slug: e.slug }, props: e.input }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgPng(props as OgInput);
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
