import { expect, test } from "@playwright/test";
import { describeRoute } from "./helpers";

for (const route of [
  "/about",
  "/story",
  "/story/through-darkness-and-light",
  "/resume",
  "/projects",
  "/projects/ff-beacon",
  "/projects/hoststing",
  "/projects/mjwalsh-net",
  "/now",
  "/uses",
  "/accessibility",
  "/contact",
  "/colophon",
  "/privacy",
  "/keyboard",
]) {
  describeRoute(route);
}

test.describe("home page", () => {
  test("has the four movements in order, each a labelled region", async ({ page }) => {
    await page.goto("/");
    const sections = page.locator("main > section");
    await expect(sections).toHaveCount(4);
    await expect(page.getByRole("region", { name: /opens the site|MICHAEL/ })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 2, name: "Things I built on my own time" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "The latest" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /This month/ })).toBeVisible();
  });
});

test.describe("story", () => {
  test("the chapter rail marks the current chapter and reports position", async ({ page }) => {
    await page.goto("/story/through-darkness-and-light");
    const rail = page.getByRole("navigation", { name: "Chapters" });
    await expect(rail.getByText("Chapter 1 of 1")).toBeVisible();
    await expect(rail.locator("a[aria-current=page]")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: "The First Darkness" })).toBeVisible();
  });
});

test.describe("resume", () => {
  test("the page, the JSON and the PDF share one source", async ({ page, request }) => {
    await page.goto("/resume");
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Full-Stack Developer and Automation / AI Specialist",
      }),
    ).toBeVisible();
    const json = await request.get("/resume.json");
    expect(json.status()).toBe(200);
    const data = (await json.json()) as { basics: { name: string }; work: { name: string }[] };
    expect(data.basics.name).toBe("Michael Walsh");
    expect(data.work[0]?.name).toBe("JWeis Marketing");
    const pdf = await request.get("/resume.pdf");
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-type"]).toContain("pdf");
  });
});

test.describe("contact form", () => {
  test("labels, inline errors tied to fields, and the announcement", async ({ page }) => {
    await page.goto("/contact?topic=accessibility&page=%2Fuses");
    await expect(page.getByRole("combobox", { name: "What is it about" })).toHaveValue(
      "accessibility",
    );
    await expect(page.getByRole("textbox", { name: "The page it concerns" })).toHaveValue("/uses");
    await page.getByRole("button", { name: "Send message" }).click();
    const name = page.getByRole("textbox", { name: "Your name" });
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-name-error")).toHaveText("Please tell me your name.");
    await expect(page.locator("[data-live-assertive]")).toHaveText("Please check the form.");
  });

  test("a valid submission reaches the function, which answers without keys", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("textbox", { name: "Your name" }).fill("A reader");
    await page.getByRole("textbox", { name: "Your email address" }).fill("reader@example.com");
    await page
      .getByRole("textbox", { name: "Your message" })
      .fill("This is a test message from the suite.");
    const response = page.waitForResponse((r) => r.url().endsWith("/api/contact"));
    await page.getByRole("button", { name: "Send message" }).click();
    const res = await response;
    // In a preview without keys the function says the form is not connected; with keys it stores and mails.
    expect([200, 503]).toContain(res.status());
    await expect(page.locator("[data-contact-status]")).not.toBeEmpty();
    await expect(page.locator("[data-contact-status]")).toBeFocused();
  });
});
