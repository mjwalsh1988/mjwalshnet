// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import { satteri } from "@astrojs/markdown-satteri";
import { headingAnchors } from "./src/lib/markdown/heading-anchors.mjs";

// Every public route is prerendered. The API routes under src/pages/api opt
// out with `export const prerender = false` and become Vercel Functions.
export default defineConfig({
  site: "https://mjwalsh.net",
  output: "static",
  trailingSlash: "never",
  build: {
    // Every stylesheet is small (about 12 KB in all) and three separate
    // render-blocking requests cost more on a slow connection than the bytes
    // do, so styles ship inline in the HTML. The HTML budget covers it.
    inlineStylesheets: "always",
  },
  adapter: vercel({
    // Astro's own sharp pipeline handles images at build, so the output is plain files.
    imageService: false,
  }),
  integrations: [
    expressiveCode({
      themes: ["github-light", "github-dark"],
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      // Inline the code block styles on the pages that have code, instead of
      // one more render-blocking stylesheet request on a slow connection.
      emitExternalStylesheet: false,
      // Line markers are not used in the site content; their styles stay out of every page.
      textMarkers: false,
      styleOverrides: {
        codeFontFamily: "var(--font-mono)",
        uiFontFamily: "var(--font-body)",
        borderRadius: "2px",
      },
      frames: {
        showCopyToClipboardButton: true,
      },
      defaultProps: {
        wrap: true,
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/dev/"),
    }),
  ],
  markdown: {
    // Expressive Code renders every code block, so Astro's own highlighter is off.
    syntaxHighlight: false,
    // The house style bans curly quotes, em dashes and ellipsis characters, so
    // the renderer must not add them after the writing checker has passed.
    processor: satteri({
      features: { smartPunctuation: false, gfm: { footnotes: { label: "Footnotes" } } },
      hastPlugins: [headingAnchors()],
    }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-display",
      // One static instance of about 18 KB. The variable file with the full 300 to
      // 900 range was 40 KB and set the largest contentful paint on every page, and
      // asking for two discrete weights brought the variable file back.
      weights: ["500"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Atkinson Hyperlegible Next",
      cssVariable: "--font-body",
      weights: ["200 800"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Arial", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-mono",
      weights: ["100 800"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Consolas", "monospace"],
    },
  ],
  security: {
    // Hash-based CSP. The site is static, so hashes stand in for nonces.
    // Inline scripts added with is:inline register their own hash through
    // Astro.csp.insertScriptHash (see PrefsScript.astro).
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
        "font-src 'self'",
        "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.analytics.google.com",
        "frame-src https://challenges.cloudflare.com https://giscus.app",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://challenges.cloudflare.com",
          "https://giscus.app",
        ],
      },
      styleDirective: {
        // Expressive Code and the font component write inline style attributes,
        // which hashes cannot cover, so styles allow inline. Scripts stay strict.
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
