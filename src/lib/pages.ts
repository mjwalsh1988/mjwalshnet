// Metadata for the fixed routes (section 4.1). Each page imports its own
// entry so the title and description live in one place, and the unit tests
// check every entry against the title and description length limits.

export type StaticPage = {
  path: string;
  title: string;
  description: string;
  /** Small label for cards and the social image. */
  eyebrow: string;
  /** Ground of the social image. The home page and the story open on ink. */
  ground?: "ink" | "paper";
};

export const STATIC_PAGES = {
  home: {
    path: "/",
    title: "Michael Walsh",
    description:
      "I am a full-stack developer and automation specialist in Fort Wayne, Indiana. I lost my sight at 34 and kept building. My story, my work and my writing.",
    eyebrow: "Blind developer in Fort Wayne, Indiana",
    ground: "ink",
  },
  story: {
    path: "/story",
    title: "My story",
    description:
      "How I lost my sight at 34 to a brain tumor, what the months before it were like, and what came after. The memoir, in chapters, as I write them.",
    eyebrow: "Traversing Darkness",
    ground: "ink",
  },
  about: {
    path: "/about",
    title: "About me",
    description:
      "The short version: who I am, what I build, where I work and how I work without sight. For people who want the facts before the story.",
    eyebrow: "About",
  },
  resume: {
    path: "/resume",
    title: "Resume",
    description:
      "My work history from freelance development at 14 through Hostgator, my own hosting company, two Director of Technology roles, and JWeis Marketing today.",
    eyebrow: "Resume",
  },
  projects: {
    path: "/projects",
    title: "Projects",
    description:
      "The things I have built on my own time and my own dime: FF Beacon, Gridiron Sites, Dynasty Price Check, Hoststing LLC, and this site. Real numbers, with sources.",
    eyebrow: "Projects",
  },
  blog: {
    path: "/blog",
    title: "Blog",
    description:
      "Writing on losing my sight, building software without it, AI and automation, SEO, fantasy football, and the Green Bay Packers. Nine categories, one voice.",
    eyebrow: "Blog",
  },
  now: {
    path: "/now",
    title: "Now",
    description:
      "What I am working on this month, what I am reading and listening to, and what changed since last month. Updated on the first of each month.",
    eyebrow: "Now",
  },
  uses: {
    path: "/uses",
    title: "Uses",
    description:
      "The tools of a blind developer: my screen reader, keyboard, editor, terminal, Claude Code setup, hardware, and the hooks that turn markdown into plain text.",
    eyebrow: "Uses",
  },
  accessibility: {
    path: "/accessibility",
    title: "Accessibility statement",
    description:
      "What this site aims for, how I test it with a screen reader, what is known to be wrong, how to report a problem, and a dated log of every fix.",
    eyebrow: "Accessibility",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description:
      "Send me a message about work, writing, accessibility or football. I read everything myself and usually answer within two working days.",
    eyebrow: "Contact",
  },
  colophon: {
    path: "/colophon",
    title: "How this site is built",
    description:
      "How this site is built: Astro, Supabase, Vercel, the typefaces, the design idea, the testing, and which words were written by me (all of them).",
    eyebrow: "Behind the site",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy",
    description:
      "What this site collects and why, in plain words: contact messages, newsletter emails and Google Analytics. Where it is stored and how to ask for deletion.",
    eyebrow: "Privacy",
  },
  keyboard: {
    path: "/keyboard",
    title: "Keyboard shortcuts",
    description:
      "Every keyboard shortcut on this site: the command palette, search, theme and reading controls, the screen reader view and the audio player.",
    eyebrow: "Keyboard",
  },
} as const satisfies Record<string, StaticPage>;

export type StaticPageKey = keyof typeof STATIC_PAGES;

export const STATIC_PAGE_LIST: StaticPage[] = Object.values(STATIC_PAGES);
