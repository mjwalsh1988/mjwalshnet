import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

export type Theme = "light" | "dark";
export const THEMES: Theme[] = ["light", "dark"];
export const WIDTHS = [360, 1280] as const;

/** Set the stored theme before the page loads so the inline script applies it. */
export async function useTheme(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("mw-prefs", JSON.stringify({ theme: t }));
    } catch {
      // Storage may be blocked; the page then follows the emulated color scheme.
    }
  }, theme);
  await page.emulateMedia({ colorScheme: theme });
}

export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
  }));
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
}

/** Collect console errors and CSP reports while the page loads. */
export function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

/**
 * Register the standard matrix for a route: both themes, both widths, axe
 * clean, no console errors, exactly one h1 and one main landmark.
 */
export function describeRoute(path: string, extra?: (page: Page) => Promise<void>) {
  test.describe(path, () => {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        test(`${theme} theme at ${width}px`, async ({ page }) => {
          await page.setViewportSize({ width, height: 900 });
          await useTheme(page, theme);
          const errors = watchConsole(page);
          const response = await page.goto(path);
          expect(response?.status(), `status for ${path}`).toBeLessThan(400);
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await expect(page.locator("h1")).toHaveCount(1);
          await expect(page.locator("main")).toHaveCount(1);
          await expectNoAxeViolations(page);
          expect(errors, errors.join("\n")).toEqual([]);
          // No horizontal scrolling at any width (reflow, 1.4.10).
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);
          if (extra) await extra(page);
        });
      }
    }
  });
}
