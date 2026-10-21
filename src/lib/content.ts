// Helpers over the content collections: published filtering, sorting,
// related posts, series neighbours. Drafts build only when the test build
// flag is set (the same flag that includes the development pages).
import { getCollection, type CollectionEntry } from "astro:content";
import { readingTime } from "./reading-time";
import { MEMOIR_SERIES } from "./taxonomy";

export type Post = CollectionEntry<"posts">;
export type Project = CollectionEntry<"projects">;
export type Chapter = CollectionEntry<"story">;
export type NowEntry = CollectionEntry<"now">;

export const includeDrafts = () => import.meta.env.DEV || process.env.BUILD_DEV_PAGES === "1";

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();

export async function getPosts(): Promise<Post[]> {
  const drafts = includeDrafts();
  const posts = await getCollection("posts", (p) => drafts || !p.data.draft);
  return posts.sort(byDateDesc);
}

export async function getProjects(): Promise<Project[]> {
  const drafts = includeDrafts();
  const projects = await getCollection("projects", (p) => drafts || !p.data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getChapters(): Promise<Chapter[]> {
  const drafts = includeDrafts();
  const chapters = await getCollection("story", (c) => drafts || !c.data.draft);
  return chapters.sort((a, b) => a.data.chapter - b.data.chapter);
}

export async function getNowEntries(): Promise<NowEntry[]> {
  const drafts = includeDrafts();
  const entries = await getCollection("now", (n) => drafts || !n.data.draft);
  return entries.sort((a, b) => b.data.month.getTime() - a.data.month.getTime());
}

export const postPath = (post: Post) => `/blog/${post.id}`;
export const projectPath = (project: Project) => `/projects/${project.id}`;
export const chapterPath = (chapter: Chapter) => `/story/${chapter.id}`;

export function postReadingTime(post: Post) {
  return readingTime(post.body ?? "");
}

/** Related posts by shared tags, then same category, newest first (section 10.3). */
export function relatedPosts(post: Post, all: Post[], count = 2): Post[] {
  const tags = new Set(post.data.tags);
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      post: p,
      score:
        p.data.tags.filter((t) => tags.has(t)).length * 2 +
        (p.data.category === post.data.category ? 1 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.post, b.post))
    .slice(0, count)
    .map((r) => r.post);
}

export function seriesPosts(series: string, all: Post[]): Post[] {
  return all
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export function allSeries(all: Post[]): string[] {
  const set = new Set<string>();
  for (const p of all) if (p.data.series) set.add(p.data.series);
  set.add(MEMOIR_SERIES);
  return [...set].sort();
}

export function allTags(all: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of all) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}
