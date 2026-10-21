// Site-wide constants. Copy lives next to the component that shows it; this
// file holds the facts every page shares.

export const SITE = {
  name: "Michael Walsh",
  url: import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://mjwalsh.net",
  description:
    "I am a full-stack developer and automation specialist in Fort Wayne, Indiana. I lost my sight at 34 and kept building. This is my story, my work and my writing.",
  locale: "en_US",
  language: "en",
  timeZone: "America/Indiana/Indianapolis",
  place: "Fort Wayne, Indiana",
  personId: "https://mjwalsh.net/#person",
  // The measurement ID is public by nature (section 10.4).
  gaMeasurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "G-1HNN2M5MQ1",
} as const;

export type NavItem = { href: string; label: string };

export const PRIMARY_NAV: NavItem[] = [
  { href: "/story", label: "Story" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now" },
  { href: "/uses", label: "Uses" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_NAV: NavItem[] = [
  { href: "/accessibility", label: "Accessibility" },
  { href: "/colophon", label: "Colophon" },
  { href: "/privacy", label: "Privacy" },
  { href: "/keyboard", label: "Keyboard shortcuts" },
  { href: "/feed.xml", label: "RSS feed" },
];

export const SOCIAL = [
  { href: "https://www.linkedin.com/in/michaeljameswalsh", label: "LinkedIn", rel: "me" },
  { href: "https://github.com/mjwalsh1988", label: "GitHub", rel: "me" },
  { href: "https://ffbeacon.com", label: "FF Beacon", rel: "me" },
  { href: "https://gridironsites.com", label: "Gridiron Sites", rel: "me" },
] as const;

/**
 * Giscus (GitHub Discussions) settings for comments. Public values. Michael
 * fills them from https://giscus.app once the repository has Discussions on;
 * while any is empty the comments section says they are coming.
 */
export const GISCUS = {
  repo: "",
  repoId: "",
  category: "Comments",
  categoryId: "",
};

export function isActive(currentPath: string, href: string): boolean {
  if (href === "/") return currentPath === "/";
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
