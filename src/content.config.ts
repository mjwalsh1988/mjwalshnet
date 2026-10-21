// Content collections (section 4.3). Frontmatter is validated at build, so a
// missing description or a bad date fails the build instead of shipping.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORY_SLUGS } from "./lib/taxonomy";

// Descriptions feed meta tags and cards: 120 to 160 characters. A placeholder
// waiting for Michael's words is allowed through so the structure can build.
const isPlaceholder = (s: string) => /^\[MICHAEL:/.test(s.trim());
const description = z
  .string()
  .refine((s) => isPlaceholder(s) || (s.length >= 120 && s.length <= 160), {
    message: "description must be 120 to 160 characters, or a [MICHAEL: ...] placeholder",
  });

const audio = z
  .object({
    src: z.string(),
    voice: z.enum(["michael", "actor", "synthetic"]),
    /** Seconds. */
    duration: z.number().int().positive(),
    transcript: z.string().optional(),
  })
  .optional();

const posts = defineCollection({
  loader: glob({
    pattern: "**/index.mdx",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1).max(90),
        description,
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        category: z.enum(CATEGORY_SLUGS),
        series: z.string().optional(),
        seriesOrder: z.number().int().positive().optional(),
        tags: z.array(z.string().regex(/^[a-z0-9-]+$/, "tags are lowercase")).default([]),
        draft: z.boolean().default(false),
        hero: image().optional(),
        heroAlt: z.string().optional(),
        heroDescription: z.string().optional(),
        audio,
        canonical: z.url().optional(),
        /** Plain-language summary shown at the top of long technical posts (section 9.3). */
        summary: z.string().optional(),
        /** Turn comments or the newsletter prompt off for one post. */
        comments: z.boolean().default(true),
      })
      .refine((p) => !p.hero || Boolean(p.heroAlt), {
        message: "heroAlt is required when hero is set",
        path: ["heroAlt"],
      })
      .refine((p) => (p.series ? p.seriesOrder !== undefined : true), {
        message: "seriesOrder is required when series is set",
        path: ["seriesOrder"],
      }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "**/index.mdx",
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(80),
      description,
      /** One line for the index grid. */
      tagline: z.string().max(120),
      url: z.url().optional(),
      role: z.array(z.string()).min(1),
      year: z.string().refine((y) => isPlaceholder(y) || /^\d{4}( to (\d{4}|present))?$/.test(y), {
        message: "year is YYYY, YYYY to YYYY, or YYYY to present",
      }),
      order: z.number().int(),
      status: z.enum(["live", "sold", "retired", "this site"]).default("live"),
      stack: z.array(z.object({ name: z.string(), use: z.string() })).default([]),
      stats: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            source: z.string(),
            asOf: z.coerce.date(),
            /** Key in site_metrics when the figure is live (section 6.6). */
            metricKey: z.string().optional(),
          }),
        )
        .default([]),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            kind: z.enum(["screenshot", "chart", "photo"]).default("screenshot"),
            caption: z.string().optional(),
            longDescription: z.string().optional(),
          }),
        )
        .default([]),
      draft: z.boolean().default(false),
    }),
});

const story = defineCollection({
  loader: glob({
    pattern: "*.mdx",
    base: "./src/content/story",
    // "01-the-first-darkness.mdx" becomes "the-first-darkness"; the number orders the file list.
    generateId: ({ entry }) => entry.replace(/^\d+-/, "").replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    chapter: z.number().int().positive(),
    summary: z.string().min(1).max(200),
    /** The years the chapter covers, as text: "2021 to 2022". */
    period: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description,
    audio,
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "./src/content/now" }),
  schema: z.object({
    /** First day of the month the entry is for. */
    month: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects, story, now };
