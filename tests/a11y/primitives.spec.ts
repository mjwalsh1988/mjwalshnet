import { expect, test } from "@playwright/test";
import { describeRoute } from "./helpers";

const PAGE = "/dev/primitives";

describeRoute(PAGE);

test.describe("primitives", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE);
  });

  test("buttons and links meet the target size and keep their roles", async ({ page }) => {
    const primary = page.getByRole("button", { name: "Send message" });
    const box = await primary.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    await expect(page.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page.getByRole("link", { name: "link to FF Beacon" })).toHaveAttribute(
      "rel",
      "external",
    );
    await expect(page.getByRole("link", { name: "link to FF Beacon" })).not.toHaveAttribute(
      "target",
      "_blank",
    );
  });

  test("the disclosure toggles with the keyboard", async ({ page }) => {
    const summary = page.getByText("Describe this image");
    const details = page.locator("details.disclosure");
    await expect(details).not.toHaveAttribute("open", "");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await expect(page.getByText("A long description would go here")).toBeVisible();
    await page.keyboard.press("Space");
    await expect(details).not.toHaveAttribute("open", "");
  });

  test("the dialog traps focus, closes on Escape and returns focus", async ({ page }) => {
    const opener = page.getByRole("button", { name: "Open the dialog" });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "A dialog" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("link", { name: "A link inside the dialog" })).toBeFocused();
    // Focus stays inside the modal: back to the close button, forward again to the link,
    // and the page behind is inert so nothing outside can take focus.
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "A link inside the dialog" })).toBeFocused();
    await page.keyboard.press("Tab");
    const escaped = await page.evaluate(() => {
      const active = document.activeElement;
      return Boolean(active && active !== document.body && !active.closest("dialog"));
    });
    expect(escaped, "focus left the dialog").toBe(false);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    // The close button works too.
    await opener.click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("the combobox listbox moves aria-activedescendant and selects with Enter", async ({
    page,
  }) => {
    const input = page.getByRole("combobox", { name: "Search the list" });
    await input.focus();
    await expect(input).toHaveAttribute("aria-controls", "combo-list");
    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-activedescendant", "opt-a");
    await expect(page.locator("#opt-a")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    await expect(input).toHaveAttribute("aria-activedescendant", "opt-b");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(input).toHaveAttribute("aria-activedescendant", "opt-c");
    await page.keyboard.press("Enter");
    await expect(page.locator("#selected")).toHaveText("Charlie");
  });

  test("the plain listbox is focusable and works with arrows, Home and End", async ({ page }) => {
    const list = page.getByRole("listbox", { name: "Plain listbox" });
    await list.focus();
    await page.keyboard.press("ArrowDown");
    await expect(list.getByRole("option", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("End");
    await expect(list.getByRole("option", { name: "Three" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("Home");
    await page.keyboard.press("Enter");
    await expect(page.locator("#selected")).toHaveText("One");
    await list.getByRole("option", { name: "Two" }).click();
    await expect(page.locator("#selected")).toHaveText("Two");
  });

  test("the live region receives announcements", async ({ page }) => {
    await page.getByRole("button", { name: "Announce a message" }).click();
    await expect(page.locator("[data-live-polite]")).toHaveText("Message number 1 announced.");
    await page.getByRole("button", { name: "Announce a message" }).click();
    await expect(page.locator("[data-live-polite]")).toHaveText("Message number 2 announced.");
  });
});
