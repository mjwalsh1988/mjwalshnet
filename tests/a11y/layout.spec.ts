import { expect, test } from "@playwright/test";
import { describeRoute } from "./helpers";

describeRoute("/");

test.describe("base layout", () => {
  test("the skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("landmarks are present once each with names on the navs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Site" })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Elsewhere" })).toHaveCount(1);
  });

  test("the home link is named once, not twice", async ({ page }) => {
    await page.goto("/");
    const home = page.getByRole("banner").getByRole("link", { name: "Michael Walsh, home" });
    await expect(home).toHaveCount(1);
    await expect(home.locator("svg")).toHaveAttribute("aria-hidden", "true");
  });

  test("the theme toggle switches the theme, persists it and reflects aria-pressed", async ({
    page,
  }) => {
    // No stored preference, light system scheme: the toggle must create and keep the preference.
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Dark theme" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Dark theme" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("the reduce motion toggle sets the motion attribute", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Reduce motion" });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduce");
  });

  test("the footer carries the place line and the report link with the page URL", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("contentinfo")).toContainText("Fort Wayne, Indiana");
    await expect(page.getByRole("contentinfo")).toContainText("It is");
    const report = page.getByRole("link", { name: "Report an accessibility problem" });
    await expect(report).toHaveAttribute("href", "/contact?topic=accessibility&page=%2F");
  });

  test("the policy meta tag hashes the inline prefs script and the browser accepts it", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/");
    const csp = await page
      .locator('meta[http-equiv="content-security-policy"]')
      .getAttribute("content");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("sha256-");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    await expect(page.locator("html")).toHaveAttribute("data-text-size", "100");
    expect(errors.filter((e) => /Content Security Policy/i.test(e))).toEqual([]);
  });
});
