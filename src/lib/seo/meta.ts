// One metadata helper for every page (section 10.3). Titles stay under 60
// characters and descriptions between 120 and 160; the unit tests check the
// static pages against those limits.
import { SITE } from "../site";

export type PageMeta = {
  /** Page title without the site name. The home page passes the site name itself. */
  title: string;
  description: string;
  /** Path starting with a slash, no trailing slash. */
  path: string;
  /** Absolute or site-relative image for social cards. Defaults to the generated OG image. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  /** Extra feed links for the head (a category page adds its own feed). */
  feeds?: { title: string; href: string }[];
};

export type ResolvedMeta = {
  title: string;
  fullTitle: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: "website" | "article" | "profile";
  noindex: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  feeds?: { title: string; href: string }[];
};

export function canonicalUrl(path: string): string {
  const clean = path === "/" ? "/" : path.replace(/\/+$/, "");
  return `${SITE.url}${clean.startsWith("/") ? clean : `/${clean}`}`;
}

export function ogSlug(path: string): string {
  return path === "/" ? "home" : path.replace(/^\/+|\/+$/g, "").replace(/\//g, "--");
}

export function ogImageUrl(path: string): string {
  return `${SITE.url}/og/${ogSlug(path)}.png`;
}

export function resolveMeta(meta: PageMeta): ResolvedMeta {
  const isHome = meta.path === "/";
  const fullTitle = isHome ? meta.title : `${meta.title} | ${SITE.name}`;
  const image = meta.image
    ? meta.image.startsWith("http")
      ? meta.image
      : `${SITE.url}${meta.image}`
    : ogImageUrl(meta.path);
  return {
    title: meta.title,
    fullTitle,
    description: meta.description,
    canonical: canonicalUrl(meta.path),
    image,
    imageAlt: meta.imageAlt ?? `${meta.title}, on mjwalsh.net`,
    type: meta.type ?? "website",
    noindex: meta.noindex ?? false,
    publishedTime: meta.publishedTime,
    modifiedTime: meta.modifiedTime,
    feeds: meta.feeds,
  };
}

export function titleLength(fullTitle: string): number {
  return fullTitle.length;
}
