import { expect, test } from "@playwright/test";
import { describeRoute } from "./helpers";

describeRoute("/blog");
describeRoute("/blog/dev-pipeline-sample");
describeRoute("/blog/category/building-blind");
describeRoute("/blog/category/traversing-darkness");
describeRoute("/blog/series/traversing-darkness");

test.describe("post page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/dev-pipeline-sample");
  });

  test("headings carry named anchor links and the table of contents lists them", async ({
    page,
  }) => {
    const anchor = page.locator("h2#a-heading-with-an-anchor a.heading-anchor");
    await expect(anchor).toHaveAttribute("href", "#a-heading-with-an-anchor");
    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc).toBeVisible();
    await expect(toc.getByRole("link", { name: "A third-level heading" })).toHaveAttribute(
      "href",
      "#a-third-level-heading",
    );
  });

  test("footnotes, code, the figure description and callouts render", async ({ page }) => {
    await expect(page.locator(".footnotes")).toContainText("The footnote text");
    await expect(page.locator(".expressive-code")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /copy/i })).toHaveCount(1);
    const describe = page.getByText("Describe this image");
    await describe.click();
    await expect(page.getByText("Michael from the shoulders up")).toBeVisible();
    await expect(page.getByRole("complementary", { name: "In plain words" })).toBeVisible();
    await expect(page.getByRole("complementary", { name: "Take care" })).toBeVisible();
  });

  test("the author box, breadcrumbs and article schema are present", async ({ page }) => {
    await expect(page.getByText("Written by Michael Walsh")).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(ld ?? "{}")["@graph"] as { "@type": string }[];
    expect(graph.map((n) => n["@type"])).toEqual([
      "Person",
      "WebSite",
      "BlogPosting",
      "BreadcrumbList",
    ]);
  });

  test("the reading time and category appear in the eyebrow", async ({ page }) => {
    const eyebrow = page.locator(".post__eyebrow");
    await expect(eyebrow).toContainText("Build Log");
    await expect(eyebrow).toContainText("minute read");
  });
});

test.describe("palette", () => {
  test("slash opens it, arrows move, Escape closes and returns focus", async ({ page }) => {
    await page.goto("/blog");
    const search = page.getByRole("banner").getByRole("button", { name: "Search" });
    await search.focus();
    await page.keyboard.press("/");
    const dialog = page.getByRole("dialog", { name: "Search and commands" });
    await expect(dialog).toBeVisible();
    const input = page.getByRole("combobox", { name: "Search posts, projects and pages" });
    await expect(input).toBeFocused();
    await expect(page.locator("#palette-results [role=option]").first()).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("ArrowDown");
    const active = await input.getAttribute("aria-activedescendant");
    expect(active).toBe("palette-option-1");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(search).toBeFocused();
  });

  test("typing searches the built index and announces the count", async ({ page }) => {
    await page.goto("/blog");
    await page.keyboard.press("Control+k");
    const input = page.getByRole("combobox", { name: "Search posts, projects and pages" });
    // The word "anchor" appears only in the sample post body, so it must be the first hit.
    await input.fill("anchor");
    await expect(page.locator("#palette-results")).toContainText("Pipeline sample");
    await expect(page.locator("[data-live-polite]")).toContainText("result");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("http://localhost:4321/blog/dev-pipeline-sample");
  });

  test("the blog search action opens the palette with the query", async ({ page }) => {
    await page.goto("/blog?q=footnote");
    const input = page.getByRole("combobox", { name: "Search posts, projects and pages" });
    await expect(input).toHaveValue("footnote");
    await expect(page.locator("#palette-results")).toContainText("Pipeline sample");
  });
});

test.describe("feeds and text endpoints", () => {
  test("RSS, JSON feed, robots and llms.txt are served with full content", async ({ request }) => {
    const rss = await request.get("/feed.xml");
    expect(rss.status()).toBe(200);
    const rssText = await rss.text();
    expect(rssText).toContain("<rss");
    expect(rssText).toContain("content:encoded");
    expect(rssText).toContain("A heading with an anchor");

    const json = await request.get("/feed.json");
    expect(json.status()).toBe(200);
    const feed = (await json.json()) as { version: string; items: { content_html: string }[] };
    expect(feed.version).toContain("jsonfeed.org/version/1.1");
    expect(feed.items.some((i) => i.content_html.includes("footnote"))).toBe(true);

    const category = await request.get("/blog/category/build-log/feed.xml");
    expect(category.status()).toBe(200);

    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Sitemap: https://mjwalsh.net/sitemap-index.xml");
    const llms = await request.get("/llms.txt");
    expect(await llms.text()).toContain("# Michael Walsh");
  });
});
