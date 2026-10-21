// @ts-check
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/**", ".astro/**", ".vercel/**", "node_modules/**", "supabase/types/**"],
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
