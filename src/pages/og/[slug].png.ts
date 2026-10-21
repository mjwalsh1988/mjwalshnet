// One social image per page, generated at build. The slug is the page path
// with slashes turned into double hyphens (see ogImageUrl in lib/seo/meta.ts);
// the home page is "home". Content collections add their entries in Phase 2.
import type { APIRoute, GetStaticPaths } from "astro";
import { renderOgPng, type OgInput } from "../../lib/og/render";
import { ogSlug } from "../../lib/seo/meta";
import { STATIC_PAGE_LIST } from "../../lib/pages";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries: { slug: string; input: OgInput }[] = STATIC_PAGE_LIST.map((page) => ({
    slug: ogSlug(page.path),
    input: { title: page.title, eyebrow: page.eyebrow, ground: page.ground ?? "paper" },
  }));
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
