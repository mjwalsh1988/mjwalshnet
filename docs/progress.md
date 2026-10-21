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

### Phase 1: UI primitives

src/components/ui: Button (link or button by props, 44 px primary target, three variants), Link (underlined by default, quiet variant, rel="external" on outside links, never a new tab), Disclosure (native details and summary, no script), Dialog (native dialog with showModal, focus moved to the first control inside, Escape and the close button both close, focus returns to the opener, backdrop click closes), LiveRegion (one polite and one assertive region in the base layout, written through announce()). src/lib/ui/listbox.ts implements the APG listbox in two arrangements: focus on the list, or a combobox where a text input keeps focus and carries aria-activedescendant. Arrow keys, Home, End, Enter, click and pointer hover are handled.

The primitives render on /dev/primitives, a page that exists only in builds made with `npm run build:test` (BUILD_DEV_PAGES=1) and is filtered out of the sitemap. tests/a11y/primitives.spec.ts runs the standard axe matrix on it and keyboard tests for every primitive. Twenty-one accessibility tests pass across the two routes.

- Decision: native dialog and details rather than ARIA re-implementations, per section 9.2 ("native elements are preferred wherever one exists"). The dialog's focus trap is the browser's own; tabbing past the last control hands focus to the browser chrome, not to the inert page, which is the expected native behaviour and what the test checks.
- Decision: the development page is gated by an environment variable in getStaticPaths instead of shipping to production under a noindex tag. Vercel runs the plain build, so the route is absent there.
- Still to do: an NVDA pass on each primitive is a manual item for Michael's testing phase (the plan calls for it before anything uses them; the automated checks stand in until then and the handoff lists it first).

### Phase 1: CI, budgets and the checks that gate it

.github/workflows/ci.yml runs two jobs on every push and pull request. The first runs the writing checker, Prettier, ESLint, astro check, the unit tests and npm audit on production dependencies. The second installs Chromium, builds with the development pages, validates every HTML file (html-validate with the a11y preset), runs the contrast check, the Playwright accessibility and end-to-end suites, and Lighthouse CI with the section 9.4 scores (accessibility, best practices and SEO at 100, performance at 95 or better) and the section 10.4 lab targets (LCP 2.0 s, CLS 0.05). scripts/check-contrast.ts samples the home page grounds and transitions. tests/e2e/budgets.spec.ts measures the section 11 budgets on the built files: compressed HTML under 60 KB per page, compressed CSS under 40 KB, first-party JavaScript under 40 KB per page and 90 KB on the home page, fonts under 180 KB.

Results today on the home page: all four Lighthouse categories 100, LCP 1.66 s, CLS 0, total blocking time 47 ms, first-party JavaScript 2.5 KB, CSS 5.5 KB, fonts 112 KB transferred.

- Decision: the plan's 150 KB cap on total JavaScript cannot be met with Google Analytics present. gtag.js alone transferred 181 KB when measured on 2026-10-21 (the plan estimated about 100 KB). The budget is therefore split: first-party JavaScript is enforced at the plan's 40 KB and 90 KB figures in the budgets test, and Lighthouse CI caps third-party script at 200 KB and total script at 290 KB. If the tag grows past that the build fails and the choice is Michael's.
- Decision: the contrast sampler treats the blended bands between the home page movements as text-free by design, because a linear blend from dusk to paper passes through a midtone (about #797570) where neither ink nor paper reaches 4.5:1. The Phase 4 arc will keep every section on a solid ground and show the blend only in the empty bands between them; the script prints the band samples so this stays visible and fails if a band is ever declared to carry text.
- Decision: the HTML validator runs on the built output rather than the source, so what visitors receive is what is checked.

### Phase 1: social image template

src/lib/og/render.ts draws the 1200 by 630 card with satori and sharp: the braille mark and an eyebrow in mono at the top, the title in Fraunces sized by length, and a meta line with the site name at the bottom, on ink or paper. src/pages/og/[slug].png.ts generates one card per fixed route at build (the content collections add theirs in Phase 2); the layout's Open Graph tags already point at these URLs. src/lib/pages.ts holds the title, description and eyebrow for every fixed route so each page, its card and the metadata tests draw from one place. scripts/og-preview.ts renders a single card for a visual check.

- Decision: the renderer uses the variable TTF builds of the three faces from the google/fonts repository, committed under src/assets/fonts/og with the OFL license text, because satori needs TTF or OTF data and the woff2 files Astro downloads for the site cannot be reused. They never ship to the browser.
- Decision: satori adds padding outside the box it sizes, so the card's margins live on an absolutely positioned inner frame rather than on the root. The first build lost the footer line to that and the preview script caught it.
- Decision: the home card's eyebrow reads "Blind developer in Fort Wayne, Indiana". The first draft was a three-item list, which the house style treats as a cadence to avoid.
