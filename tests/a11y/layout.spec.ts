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

  test("the theme toggle switches the theme, persists it and changes its label", async ({
    page,
  }) => {
    // No stored preference, light system scheme: the toggle must create and keep the preference.
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/about");
    const toDark = page.getByRole("button", { name: "Switch to dark theme" });
    const toLight = page.getByRole("button", { name: "Switch to light theme" });
    await expect(toDark).toBeVisible();
    await expect(toLight).toHaveCount(0);
    const lightText = await page.evaluate(() => getComputedStyle(document.body).color);
    await toDark.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toLight).toBeVisible();
    await expect(toDark).toHaveCount(0);
    await expect(page.locator("[data-live-polite]")).toHaveText("Dark theme on.");
    // The text color has to change too, which proves the tokens followed the attribute.
    expect(await page.evaluate(() => getComputedStyle(document.body).color)).not.toBe(lightText);
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      "content",
      "#141210",
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(toLight).toBeVisible();
    await toLight.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(toDark).toBeVisible();
  });

  test("a theme switch in one tab reaches the other, and its toggle still works", async ({
    context,
  }) => {
    const a = await context.newPage();
    const b = await context.newPage();
    await a.emulateMedia({ colorScheme: "light" });
    await b.emulateMedia({ colorScheme: "light" });
    await a.goto("/about");
    await b.goto("/contact");
    await a.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(b.locator("html")).toHaveAttribute("data-theme", "dark");
    await b.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(b.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(a.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("search results are styled as separate rows in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"]) {
      await page.goto("/about");
      await page.evaluate((t) => {
        localStorage.setItem("mw-prefs", JSON.stringify({ theme: t }));
      }, theme);
      await page.reload();
      await page.getByRole("button", { name: "Search" }).click();
      const dialog = page.getByRole("dialog", { name: "Search and commands" });
      const options = dialog.getByRole("option");
      await expect(options.first()).toBeVisible();
      // The rows are built by script; a scoped style would leave them as plain inline text.
      expect(await options.first().evaluate((el) => getComputedStyle(el).display)).toBe("grid");
      const colors = await dialog.evaluate((el) => {
        const s = getComputedStyle(el);
        return { bg: s.backgroundColor, fg: s.color };
      });
      expect(colors.bg).toBe(theme === "dark" ? "rgb(20, 18, 16)" : "rgb(246, 242, 234)");
      await page.keyboard.press("Escape");
    }
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
