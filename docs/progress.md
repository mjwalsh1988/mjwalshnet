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

### Phase 1: design tokens, both themes, preference store

src/styles/tokens.css holds the raw palette (ink, paper, lamp, lamp-dim, ember, two smokes, dusk, surfaces, borders, signals), the fluid type scale, spacing, motion and focus values, and the semantic tokens for the light theme, the dark theme, the four home page movements, the reading controls and a high contrast mode. src/lib/contrast is the WCAG arithmetic shared by the token tests and, later, the scroll arc sampler. src/lib/prefs.ts is the typed preference store (theme, text size, line spacing, high contrast, dyslexia spacing, reduced motion) with the inline pre-paint script kept as a string so a test can execute it and the layout can hash it. tests/unit/tokens.test.ts parses tokens.css and checks every pair: body text at 7:1 in both themes, accents and signals at 4.5:1 or better, borders at 3:1.

- Decision: final token values. ink #141210, paper #F6F2EA (16.7:1), lamp #D9941F (7.3:1 on ink), lamp-dim #D4A04A for dark theme text (7.9:1), ember #73420A (7.5:1 on paper), smoke #5E5A54 on paper (6.1:1) and #B3ADA3 on ink (8.4:1), dusk #26221E (lamp reaches 6.2:1 on it), borders #857D72 and #6F685F (3:1 or better as non-text contrast). The plan's starting values survived; the border values were raised from the first draft because 1.6:1 borders failed the non-text contrast rule.
- Decision: Content Security Policy is on through Astro's security.csp with hashes for scripts. The style directive allows inline because Expressive Code and Astro's font component write style attributes, which hashes cannot cover. frame-ancestors stays out of the meta tag (browsers ignore it there) and X-Frame-Options in vercel.json covers framing.
- Decision: Astro's own Shiki highlighter is switched off because Expressive Code renders every code block; this also silences the CSP warning Astro prints about Shiki.
- Decision: the preference store uses one localStorage key, mw-prefs, and data attributes on html rather than classes, so CSS can address each setting independently.

### Phase 1: fonts

Fraunces, Atkinson Hyperlegible Next and JetBrains Mono are self-hosted through the Astro Fonts API from the Google provider, Latin subset, variable weights, with metric-matched fallbacks generated from Georgia, Arial and Consolas. The body and display faces are preloaded from the base layout.

- Decision: Fraunces ships in the upright style only. With both italics the four families came to 194 KB of woff2 against the plan's 180 KB budget; dropping the display italic brings the total to 149 KB. Atkinson keeps its italic for emphasis in prose.

### Phase 1: braille mark and favicon set

src/components/site/BrailleMark.astro draws the M and W cells as two six-dot grids: present dots filled, absent dots as faint small circles so the grid reads. It is decorative unless given a label. scripts/build-icons.mjs renders the filled dots to favicon.svg (which follows the color scheme on its own), favicon-32.png, apple-touch-icon.png, the two manifest icons and site.webmanifest. Outputs are committed; rerun the script only if the mark changes.

### Phase 1: Analytics component

src/components/site/Analytics.astro sets Consent Mode defaults (analytics storage denied in the EEA and the UK until consent, granted elsewhere; every advertising signal denied everywhere), then injects gtag.js after the window load event. Google Signals and ad personalization are off in the config call. The measurement ID comes from PUBLIC_GA_MEASUREMENT_ID with G-1HNN2M5MQ1 as the built-in default, since the value is public. window.mwTrack is the one function the site's own features call for custom events; it does nothing when the tag is not loaded.

- Decision: the tag loads only when the page's hostname is the production host, or when the URL carries ?analytics=on. Preview builds, the Playwright suites and local work therefore send nothing to the property, and Lighthouse CI opens its pages with the query string so budgets are measured with the tag present, as the plan asks.
- Still Michael's: set the property's data retention to 14 months in the Google Analytics admin (section 10.4). The code cannot do that.

### Phase 1: base layout

src/layouts/Base.astro: metadata from one helper (src/lib/seo/meta.ts), canonical, Open Graph and Twitter tags, theme-color for both schemes, the inline preference script, font preloads, feed and sitemap links, the favicon set, speculation rules for same-site prefetch (hashed for the policy), an optional JSON-LD slot, then skip link, header, main with tabindex -1, footer and the analytics component. Header: the mark plus "Michael Walsh" as one link named "Michael Walsh, home", a nav labelled Main with aria-current on the active item and the accent used only as the active rule, and the theme toggle. Footer: the mark, the Fort Wayne place line with a live local time, a one-line statement about the writing, two labelled navs (Site and Elsewhere, with rel="me" on the profiles), a display settings group with the reduce motion toggle, and "Report an accessibility problem", which links to the contact page with the current path.

Tests: tests/a11y/helpers.ts registers the standard matrix for a route (both themes at 360 and 1280 px, axe with WCAG 2.2 AA and best-practice tags, no console errors, one h1, one main, no horizontal overflow). tests/a11y/layout.spec.ts runs it on the home page and adds keyboard tests for the skip link, landmark names, the home link name, the theme toggle (state, persistence, aria-pressed), the motion toggle, the footer place line and report link, and the policy meta tag. Eleven tests pass.

- Decision: the main nav wraps onto a second row under 48rem instead of collapsing into a menu button. Eight short mono labels fit in two rows at 360 px, nothing is hidden, and there is no JavaScript to fail or focus to manage.
- Decision: the theme control is a toggle button whose label never changes ("Dark theme") and whose aria-pressed carries the state, following the ARIA toggle button pattern. The same shape is used for "Reduce motion" in the footer.
- Decision: the home link uses aria-label="Michael Walsh, home" so the name is exact regardless of how the markup is formatted. The visible text is contained in the name, so label-in-name holds.
- Decision: the local time renders only through JavaScript. Without it the footer shows the place alone rather than a stale build-time clock.
