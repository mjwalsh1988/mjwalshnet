// Captures real screenshots of Michael's live projects at 2x for the project
// pages (section 7.4). Run on demand: node scripts/capture-screenshots.mjs
// Name projects to capture only those, for example:
//   node scripts/capture-screenshots.mjs ff-beacon hoststing
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const targets = [
  {
    slug: "ff-beacon",
    url: "https://ffbeacon.com",
    // The sidebar shown as its strip of icons, which FF Beacon remembers in storage.
    storage: { "ffbeacon:sidebar-expanded": "0" },
  },
  { slug: "gridiron-sites", url: "https://gridironsites.com" },
  { slug: "dynasty-price-check", url: "https://dynastypricecheck.com" },
  // The hero buttons fade in after load, so the shot waits for them.
  { slug: "hoststing", url: "https://hoststing.com", wait: 6000 },
];

const only = process.argv.slice(2);
const browser = await chromium.launch();
for (const t of targets.filter((t) => only.length === 0 || only.includes(t.slug))) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  if (t.storage) {
    await context.addInitScript((entries) => {
      for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
    }, t.storage);
  }
  const page = await context.newPage();
  await page.goto(t.url, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(t.wait ?? 1500);
  const out = `src/content/projects/${t.slug}/home.png`;
  mkdirSync(`src/content/projects/${t.slug}`, { recursive: true });
  await page.screenshot({ path: out, fullPage: false });
  console.log(`captured ${t.url} to ${out}`);
  await context.close();
}
await browser.close();
