// Builds the site with the development-only pages included (src/pages/dev),
// which the accessibility suite needs. Production builds never set the flag.
import { execSync } from "node:child_process";

execSync("npm run build", {
  stdio: "inherit",
  env: { ...process.env, BUILD_DEV_PAGES: "1" },
});
