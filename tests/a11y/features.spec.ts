import { expect, test } from "@playwright/test";

test.describe("the scroll arc", () => {
  test("the home page has bands between the movements and no text in them", async ({ page }) => {
    await page.goto("/");
    const bands = page.locator("main > .band");
    await expect(bands).toHaveCount(2);
    for (const band of await bands.all()) {
      expect((await band.innerText()).trim()).toBe("");
      await expect(band).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("reduced motion turns the ground animation off", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const name = await page.evaluate(() => getComputedStyle(document.body).animationName);
    expect(name).toBe("none");
  });

  test("with motion allowed the ground animates where the browser supports it", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const result = await page.evaluate(() => ({
      supported: CSS.supports("animation-timeline: scroll()"),
      name: getComputedStyle(document.body).animationName,
    }));
    if (result.supported) expect(result.name).toBe("home-ground");
    else expect(result.name).toBe("none");
  });
});

test.describe("what my screen reader hears", () => {
  test("opens from the footer and lists the page as a stream", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "What my screen reader hears" }).first().click();
    const dialog = page.getByRole("dialog", { name: "What my screen reader hears" });
    await expect(dialog).toBeVisible();
    const lines = dialog.locator("[data-sr-stream] li");
    const texts = await lines.allInnerTexts();
    expect(texts[0]).toBe("link, Skip to main content");
    expect(texts).toContain("banner landmark");
    expect(texts).toContain("Main navigation landmark");
    expect(texts).toContain("heading level 1, About me");
    expect(texts.some((t) => t.startsWith("image, Michael Walsh smiling"))).toBe(true);
    expect(texts.some((t) => t === "button, Switch to dark theme")).toBe(true);
    expect(texts).toContain("end of main landmark");
    // The view never reads itself.
    expect(
      texts.filter((t) => t.includes("What my screen reader hears")).length,
    ).toBeLessThanOrEqual(2);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("reading controls", () => {
  test("text size and spacing apply to the page and persist", async ({ page }) => {
    await page.goto("/uses");
    await page.getByRole("button", { name: "Reading" }).click();
    const dialog = page.getByRole("dialog", { name: "Reading settings" });
    await expect(dialog).toBeVisible();
    await page.getByRole("combobox", { name: "Text size" }).selectOption("150");
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "150");
    await page.getByRole("checkbox", { name: "Dyslexia-friendly letter and word spacing" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-dyslexia", "on");
    await page.getByRole("checkbox", { name: "High contrast, beyond AA" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
    expect(size).toBeGreaterThan(24);
    await page.keyboard.press("Escape");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "150");
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    // No horizontal overflow at 200 percent on a narrow screen (1.4.4, 1.4.10).
    await page.setViewportSize({ width: 360, height: 800 });
    await page.getByRole("button", { name: "Reading" }).click();
    await page.getByRole("combobox", { name: "Text size" }).selectOption("200");
    await page.keyboard.press("Escape");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await page.getByRole("button", { name: "Reading" }).click();
    await page.getByRole("button", { name: "Back to the defaults" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "100");
  });
});

test.describe("listen mode", () => {
  test("a page without a recording offers the synthetic voice, labelled as such", async ({
    page,
  }) => {
    await page.goto("/story/through-darkness-and-light");
    const region = page.getByRole("region", { name: /Listen/ });
    await expect(region).toContainText("No recording yet");
    const button = page.getByRole("button", { name: "Read aloud with a synthetic voice" });
    await expect(button).toBeVisible();
    await expect(region).toContainText("synthetic and it is not me");
  });
});

test.describe("charts", () => {
  test("a chart is an image with a title and its data table under a disclosure", async ({
    page,
  }) => {
    await page.goto("/blog/dev-pipeline-sample");
    const chart = page.getByRole("img", { name: /Automated tests on this site by kind/ });
    await expect(chart).toBeVisible();
    await page.getByText("Show the data").click();
    await expect(
      page.getByRole("table", { name: "Automated tests on this site by kind" }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "163" })).toBeVisible();
  });
});

test.describe("live numbers", () => {
  test("the home page shows figures with a source and date", async ({ page }) => {
    await page.goto("/");
    const strip = page.getByRole("region", { name: "Live numbers" });
    await expect(strip).toContainText("Automated tests on this site");
    await expect(strip).toContainText("Source:");
    await expect(strip).toContainText("Days since the last post");
  });

  test("the metrics function refuses calls without the secret", async ({ request }) => {
    const res = await request.get("/api/metrics");
    expect([401, 503]).toContain(res.status());
  });
});

test.describe("newsletter and comments", () => {
  test("the subscribe form explains when the newsletter is not live", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("textbox", { name: "Your email address" }).fill("reader@example.com");
    const response = page.waitForResponse((r) => r.url().endsWith("/api/subscribe"));
    await page.getByRole("button", { name: "Subscribe" }).click();
    const res = await response;
    expect([200, 503]).toContain(res.status());
    const status = page.locator("[data-subscribe-status]");
    await expect(status).not.toBeEmpty();
    await expect(status).toBeFocused();
  });

  test("the comments section says comments are coming until Giscus is configured", async ({
    page,
  }) => {
    await page.goto("/blog/dev-pipeline-sample");
    const comments = page.getByRole("region", { name: "Comments" });
    await expect(comments).toBeVisible();
    await expect(comments).toContainText(/Load the comments|comments go live/);
  });
});
