// Webmentions (section 6.12), received through webmention.io and rendered at
// build. The public API needs no token for reading. Any failure (no account
// yet, network, timeout) returns an empty list and logs one line, so a build
// never depends on it.
import { SITE } from "./site";

export type Mention = {
  type: "like" | "repost" | "reply" | "mention";
  author: { name: string; url?: string; photo?: string };
  url: string;
  published?: string;
  content?: string;
};

type Jf2 = {
  children?: {
    "wm-property"?: string;
    author?: { name?: string; url?: string; photo?: string };
    url?: string;
    published?: string;
    "wm-received"?: string;
    content?: { text?: string };
  }[];
};

const WM_TYPES: Record<string, Mention["type"]> = {
  "like-of": "like",
  "repost-of": "repost",
  "in-reply-to": "reply",
  "mention-of": "mention",
};

let warned = false;

export async function getMentions(path: string): Promise<Mention[]> {
  const target = `${SITE.url}${path}`;
  const api = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}&per-page=100`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(api, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`webmention.io answered ${res.status}`);
    const data = (await res.json()) as Jf2;
    return (data.children ?? [])
      .map((c) => ({
        type: WM_TYPES[c["wm-property"] ?? ""] ?? ("mention" as const),
        author: { name: c.author?.name || "Someone", url: c.author?.url, photo: c.author?.photo },
        url: c.url ?? "",
        published: c.published ?? c["wm-received"],
        content: c.content?.text?.slice(0, 500),
      }))
      .filter((m) => m.url);
  } catch (error) {
    if (!warned) {
      warned = true;
      console.info(`webmentions are off for this build (${(error as Error).message})`);
    }
    return [];
  }
}
