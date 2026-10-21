// The nine blog categories in their three groups (section 4.2). Slugs are the
// contract: they appear in frontmatter, URLs and feeds. Each description is
// one paragraph in Michael's words; until he writes it, a placeholder.

export type CategoryGroup = "story" | "work" | "football";

export type Category = {
  slug: string;
  name: string;
  group: CategoryGroup;
  description: string;
};

export const CATEGORY_GROUPS: { id: CategoryGroup; title: string }[] = [
  { id: "story", title: "The story" },
  { id: "work", title: "The work" },
  { id: "football", title: "Football" },
];

export const CATEGORIES: Category[] = [
  {
    slug: "traversing-darkness",
    name: "Traversing Darkness",
    group: "story",
    description:
      "[MICHAEL: one paragraph on this category: sight loss, the medical story, the emotional side, and the practical business of building a good life without sight]",
  },
  {
    slug: "building-blind",
    name: "Building Blind",
    group: "story",
    description:
      "[MICHAEL: one paragraph on how you actually work as a blind developer: screen readers, terminals, Claude Code, testing by ear]",
  },
  {
    slug: "life",
    name: "Life",
    group: "story",
    description:
      "[MICHAEL: one paragraph on the Life category: your girlfriend, family, Fort Wayne, food, the ordinary days]",
  },
  {
    slug: "ai-and-automation",
    name: "AI and Automation",
    group: "work",
    description:
      "[MICHAEL: one paragraph on AI and automation work: Claude as a bounded, logged step, pipelines, GoHighLevel and A2P, what worked and what did not]",
  },
  {
    slug: "programming",
    name: "Programming",
    group: "work",
    description:
      "[MICHAEL: one paragraph on the Programming category: Next.js, Astro, Supabase, TypeScript, the hosting and Linux years]",
  },
  {
    slug: "seo-and-marketing",
    name: "SEO and Marketing",
    group: "work",
    description:
      "[MICHAEL: one paragraph on SEO and marketing: contractor marketing, Search Console, technical SEO, the agency side]",
  },
  {
    slug: "build-log",
    name: "Build Log",
    group: "work",
    description:
      "[MICHAEL: one or two sentences on the Build Log: short dated notes on what shipped across your projects]",
  },
  {
    slug: "fantasy-football",
    name: "Fantasy Football",
    group: "football",
    description:
      "[MICHAEL: one paragraph on fantasy football: twenty seasons of dynasty, superflex and tight end premium, FF Beacon, playing by ear]",
  },
  {
    slug: "packers-and-the-nfl",
    name: "Packers and the NFL",
    group: "football",
    description:
      "[MICHAEL: one paragraph on the Packers and the NFL: Green Bay first, the league second, how a blind fan follows a game]",
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export function categoryBySlug(slug: string): Category {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category: ${slug}`);
  return found;
}

export function categoriesInGroup(group: CategoryGroup): Category[] {
  return CATEGORIES.filter((c) => c.group === group);
}

export const categoryPath = (slug: string) => `/blog/category/${slug}`;
export const categoryFeedPath = (slug: string) => `/blog/category/${slug}/feed.xml`;
export const seriesPath = (slug: string) => `/blog/series/${slug}`;

/** The memoir publishes as this series in the blog as well as on /story. */
export const MEMOIR_SERIES = "traversing-darkness";
