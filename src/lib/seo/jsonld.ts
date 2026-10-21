// JSON-LD builders (section 10.2). Every page carries the Person and WebSite
// nodes in one @graph; posts, projects, the about page and nested routes add
// their own. Snapshot tests in tests/unit/jsonld.test.ts pin the output.
import { SITE, SOCIAL } from "../site";

export type JsonLd = Record<string, unknown>;

const WEBSITE_ID = `${SITE.url}/#website`;
const PORTRAIT = `${SITE.url}/img/michael-walsh.jpg`;

export function person(): JsonLd {
  return {
    "@type": "Person",
    "@id": SITE.personId,
    name: "Michael Walsh",
    url: SITE.url,
    image: PORTRAIT,
    jobTitle: "Full-Stack Developer and Automation / AI Specialist",
    worksFor: { "@type": "Organization", name: "JWeis Marketing", url: "https://jweis.com" },
    homeLocation: { "@type": "Place", name: "Fort Wayne, Indiana" },
    sameAs: SOCIAL.map((s) => s.href),
    knowsAbout: [
      "Web accessibility",
      "Screen readers",
      "Full-stack development",
      "Automation",
      "Search engine optimization",
      "Web hosting",
      "Fantasy football",
    ],
  };
}

export function website(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": SITE.personId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPage(input: {
  url: string;
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLd {
  return {
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.title,
    description: input.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": SITE.personId },
    inLanguage: SITE.language,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function profilePage(input: {
  url: string;
  dateCreated: string;
  dateModified: string;
}): JsonLd {
  return {
    "@type": "ProfilePage",
    "@id": `${input.url}#profile`,
    url: input.url,
    dateCreated: input.dateCreated,
    dateModified: input.dateModified,
    mainEntity: { "@id": SITE.personId },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function blogPosting(input: {
  url: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  wordCount: number;
  category: string;
  tags: string[];
}): JsonLd {
  return {
    "@type": "BlogPosting",
    "@id": `${input.url}#post`,
    mainEntityOfPage: input.url,
    url: input.url,
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image,
    wordCount: input.wordCount,
    articleSection: input.category,
    keywords: input.tags.join(", "),
    inLanguage: SITE.language,
    author: { "@id": SITE.personId },
    publisher: { "@id": SITE.personId },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function softwareApplication(input: {
  url: string;
  name: string;
  description: string;
  siteUrl?: string;
  dateCreated?: string;
}): JsonLd {
  return {
    "@type": "SoftwareApplication",
    "@id": `${input.url}#software`,
    name: input.name,
    description: input.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    ...(input.siteUrl ? { installUrl: input.siteUrl, url: input.siteUrl } : {}),
    ...(input.dateCreated ? { dateCreated: input.dateCreated } : {}),
    author: { "@id": SITE.personId },
    creator: { "@id": SITE.personId },
  };
}

export function creativeWork(input: { url: string; name: string; description: string }): JsonLd {
  return {
    "@type": "CreativeWork",
    "@id": `${input.url}#work`,
    url: input.url,
    name: input.name,
    description: input.description,
    author: { "@id": SITE.personId },
  };
}

/** Wrap nodes in the single @graph every page emits. */
export function graph(nodes: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": [person(), website(), ...nodes] };
}
