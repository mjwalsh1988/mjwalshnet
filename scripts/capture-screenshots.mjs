// Captures real screenshots of Michael's live projects at 2x for the project
// pages (section 7.4). Run on demand: node scripts/capture-screenshots.mjs
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const targets = [
  { url: "https://ffbeacon.com", out: "src/content/projects/ff-beacon/home.png" },
  { url: "https://gridironsites.com", out: "src/content/projects/gridiron-sites/home.png" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
for (const t of targets) {
  const page = await context.newPage();
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1500);
  mkdirSync(t.out.split("/").slice(0, -1).join("/"), { recursive: true });
  await page.screenshot({ path: t.out, fullPage: false });
  console.log(`captured ${t.url} to ${t.out}`);
  await page.close();
}
await browser.close();
