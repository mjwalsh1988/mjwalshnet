// Sätteri hast plugin: gives every h2, h3 and h4 in Markdown and MDX content an
// id and wraps its text in a same-page link, so a heading can be shared and
// focused. The link's name is the heading text itself, so a screen reader
// hears "heading level 2, link, The first sign" with nothing added, and the
// table of contents (built by Astro from the heading text) stays clean. The
// same pattern MDN uses.
//
// Astro's own heading-ids plugin runs after user plugins, so the id is set
// here with the same slugger Astro uses; Astro then keeps the existing id and
// the table of contents slugs match.
import Slugger from "github-slugger";

/** @returns {() => import("satteri").HastPluginDefinition} */
export function headingAnchors() {
  return () => {
    const slugger = new Slugger();
    return {
      name: "heading-anchors",
      element: {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
        visit(node, ctx) {
          const text = ctx.textContent(node).trim();
          const existing = node.properties?.id;
          const id = typeof existing === "string" && existing ? existing : slugger.slug(text);
          if (typeof existing !== "string") ctx.setProperty(node, "id", id);
          if (!["h2", "h3", "h4"].includes(node.tagName)) return;
          if (node.properties?.dataNoAnchor !== undefined) return;
          const link = {
            type: "element",
            tagName: "a",
            properties: { href: `#${id}`, className: ["heading-anchor"] },
            children: [],
          };
          const children = node.children;
          if (children.length === 1 && children[0] && children[0].type === "text") {
            // The common case: plain text, wrapped in the link.
            ctx.wrapNode(children[0], link);
            return;
          }
          // Headings with inline markup keep their children and get a labelled
          // empty link after them; the "#" glyph comes from CSS so no text is
          // added to the heading.
          ctx.appendChild(node, {
            ...link,
            properties: {
              ...link.properties,
              className: ["heading-anchor", "heading-anchor--after"],
              "aria-label": `Section link: ${text}`,
            },
          });
        },
      },
    };
  };
}
