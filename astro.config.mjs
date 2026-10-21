// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vercel from "@astrojs/vercel";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import { satteri } from "@astrojs/markdown-satteri";

// Every public route is prerendered. The API routes under src/pages/api opt
// out with `export const prerender = false` and become Vercel Functions.
export default defineConfig({
  site: "https://mjwalsh.net",
  output: "static",
  trailingSlash: "never",
  adapter: vercel({
    // Astro's own sharp pipeline handles images at build, so the output is plain files.
    imageService: false,
  }),
  integrations: [
    expressiveCode({
      themes: ["github-light", "github-dark"],
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        codeFontFamily: "var(--font-mono)",
        uiFontFamily: "var(--font-body)",
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    // The house style bans curly quotes, em dashes and ellipsis characters, so
    // the renderer must not add them after the writing checker has passed.
    processor: satteri({
      features: { smartPunctuation: false },
    }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-display",
      weights: ["300 900"],
      styles: ["normal", "italic"],
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
  vite: {
    plugins: [tailwindcss()],
  },
});
