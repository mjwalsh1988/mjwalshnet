import { describe, expect, it } from "vitest";
import {
  blogPosting,
  breadcrumbs,
  graph,
  profilePage,
  softwareApplication,
  webPage,
} from "../../src/lib/seo/jsonld";

// Snapshots pin the shape of each page type's structured data (section 13,
// Phase 2). Update them on purpose with `npx vitest run -u` after a change.
describe("JSON-LD builders", () => {
  it("every page carries the Person and WebSite graph", () => {
    const g = graph([]) as { "@graph": { "@type": string; "@id": string }[] };
    expect(g["@graph"].map((n) => n["@type"])).toEqual(["Person", "WebSite"]);
    expect(g["@graph"][0]?.["@id"]).toBe("https://mjwalsh.net/#person");
    expect(g).toMatchSnapshot();
  });

  it("a blog post", () => {
    expect(
      graph([
        blogPosting({
          url: "https://mjwalsh.net/blog/how-i-write-code-i-cannot-see",
          title: "How I write code I cannot see",
          description: "A description of the post.",
          datePublished: "2026-11-01",
          image: "https://mjwalsh.net/og/blog--how-i-write-code-i-cannot-see.png",
          wordCount: 1800,
          category: "Building Blind",
          tags: ["nvda", "claude-code"],
        }),
        breadcrumbs([
          { name: "Blog", url: "https://mjwalsh.net/blog" },
          { name: "Building Blind", url: "https://mjwalsh.net/blog/category/building-blind" },
          {
            name: "How I write code I cannot see",
            url: "https://mjwalsh.net/blog/how-i-write-code-i-cannot-see",
          },
        ]),
      ]),
    ).toMatchSnapshot();
  });

  it("the about page", () => {
    expect(
      graph([
        profilePage({
          url: "https://mjwalsh.net/about",
          dateCreated: "2026-10-21",
          dateModified: "2026-10-21",
        }),
      ]),
    ).toMatchSnapshot();
  });

  it("a project page", () => {
    expect(
      graph([
        softwareApplication({
          url: "https://mjwalsh.net/projects/ff-beacon",
          name: "FF Beacon",
          description: "A description.",
          siteUrl: "https://ffbeacon.com",
        }),
        breadcrumbs([
          { name: "Projects", url: "https://mjwalsh.net/projects" },
          { name: "FF Beacon", url: "https://mjwalsh.net/projects/ff-beacon" },
        ]),
      ]),
    ).toMatchSnapshot();
  });

  it("a plain page", () => {
    expect(
      graph([
        webPage({
          url: "https://mjwalsh.net/uses",
          title: "Uses",
          description: "A description.",
          dateModified: "2026-10-21",
        }),
      ]),
    ).toMatchSnapshot();
  });
});
