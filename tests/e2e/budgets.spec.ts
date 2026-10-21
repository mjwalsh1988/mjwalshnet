// Performance budgets from section 11, measured on the built output in dist.
// Lighthouse CI covers the scores and totals; this checks the first-party
// numbers that Lighthouse cannot separate from the analytics tag.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";

const DIST = "dist/client";
const KB = 1024;

const gz = (file: string) => gzipSync(readFileSync(file)).length;

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "pagefind" && entry !== "dev") htmlFiles(full, out);
    } else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** First-party scripts and styles a page loads, resolved to files in dist. */
function assetsOf(html: string) {
  const scripts = [...html.matchAll(/<script[^>]+src="(\/_astro\/[^"]+)"/g)].map((m) => m[1]!);
  const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(\/_astro\/[^"]+)"/g)].map(
    (m) => m[1]!,
  );
  const inlineStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]!);
  return { scripts, styles, inlineStyles };
}

test.describe("performance budgets", () => {
  test.skip(!existsSync(DIST), "run npm run build first");

  test("fonts total under 180 KB", () => {
    const dir = path.join(DIST, "_astro", "fonts");
    const total = readdirSync(dir).reduce((sum, f) => sum + statSync(path.join(dir, f)).size, 0);
    expect(total, "font bytes").toBeLessThanOrEqual(180 * KB);
  });

  for (const file of htmlFiles(DIST)) {
    const route =
      "/" +
      path
        .relative(DIST, file)
        .replace(/\\/g, "/")
        .replace(/index\.html$/, "");
    test(`${route} stays within the HTML, CSS and script budgets`, () => {
      const html = readFileSync(file, "utf8");
      expect(gz(file), "compressed HTML").toBeLessThanOrEqual(60 * KB);
      const { scripts, styles, inlineStyles } = assetsOf(html);
      const css =
        styles.reduce((sum, href) => sum + gz(path.join(DIST, href)), 0) +
        gzipSync(inlineStyles.join("\n")).length;
      expect(css, "compressed CSS").toBeLessThanOrEqual(40 * KB);
      const js = scripts.reduce((sum, src) => sum + gz(path.join(DIST, src)), 0);
      const limit = route === "/" ? 90 * KB : 40 * KB;
      expect(js, `compressed first-party JS on ${route}`).toBeLessThanOrEqual(limit);
    });
  }
});
