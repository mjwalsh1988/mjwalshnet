# Build progress

One entry per task, dated, newest at the bottom. Judgment calls are marked "Decision".

## 2026-10-21

### Commit the plan and Supabase setup

Committed the revised plan, the two migrations, the generated database types, package.json and README as "Add build plan and Supabase setup".

### Phase 1: scaffold

Astro 7.4.1 with TypeScript strict, Tailwind 4 through the Vite plugin, the Vercel adapter in static mode, MDX, sitemap, Expressive Code, ESLint 10 with typescript-eslint and the Astro plugin (jsx-a11y strict), Prettier with the Astro plugin, Vitest 5, Playwright 1.64 with axe, Lighthouse CI, html-validate and tsx. vercel.json carries the trailing slash policy, the daily metrics cron and the security headers. .env.example lists every variable from section 8.4 with no values.

- Decision: TypeScript pinned to 5.9.3. The registry's latest is 7.0.2, the new native compiler, and astro check has not been verified against it.
- Decision: Sätteri stays as the Markdown processor (it is Astro 7's default and the Rust compiler is fast) with smart punctuation turned off, so the renderer cannot add the curly quotes, em dashes and ellipsis characters the writing rules ban after the checker has passed the source.
- Decision: Pagefind runs from scripts/postbuild.mjs rather than a bare `pagefind --site dist`, because the Vercel adapter copies dist into .vercel/output/static before postbuild runs and the index has to be mirrored there or production search would 404.
- Decision: Content Security Policy will use Astro's built-in hash generation (security.csp) instead of nonces. The site is static, so there is no per-request nonce; hashes give the same guarantee. Wired in the base layout task.
- Note: npm audit reports 31 advisories, all inside @lhci/cli's old dependency tree (and one in uuid). They are dev-only and do not ship. Revisit when Lighthouse CI publishes a newer release.
- Note: the three font families with normal and italic styles come to about 194 KB of woff2. The plan's budget is 180 KB. Revisit in the fonts task.

### Phase 1: writing checker

scripts/check-writing.ts scans Markdown and MDX prose (including frontmatter values and alt text in JSX tags), Astro template text and copy-bearing attributes, and comments and string literals in TypeScript. It fails on em dashes, curly quotes, ellipsis characters, emoji, the banned word list, formulaic transitions at sentence starts, vague authority, significance inflation, conversational scaffolding, negative parallelism and Title Case headings. Thirteen unit tests cover it. It runs from a git pre-commit hook in .githooks (installed by the npm prepare script) and will run in CI.

- Decision: the memoir folder (src/content/story) is exempt from the Title Case heading rule only, because Michael's section headings ("The First Sign") are his own style and the rule says to match the surrounding voice.
- Decision: a line can be exempted with a comment reading "writing-check: ignore-next-line", for cases such as quoting a LinkedIn sentence in order to rewrite it. Each use should say why.
- Decision: the rule-of-three cadence is not machine-checked. It needs judgment, so it stays a manual pass item and is reported in the end-of-session writing summary.
- Also added .gitattributes so every text file commits with LF endings and the CRLF warnings stop.
