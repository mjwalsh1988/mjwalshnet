import { defineConfig, devices } from "@playwright/test";

// The suites run against the built site served by scripts/serve.mjs (static
// files plus the server entry), so they test what visitors get.
const port = 4321;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["a11y/**/*.spec.ts", "e2e/**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node scripts/serve.mjs --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
