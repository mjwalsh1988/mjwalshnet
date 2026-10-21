# Handoff for the testing phase

Written 2026-10-21 at the end of the Phase 1 to 4 build. docs/progress.md has the dated entry per task and every judgment call. Phase 5 (launch) and the manual pass come after the keys are in. Updated later the same day after the Phase 0 keyword research (section 7), and everything was pushed to main on GitHub.

## 1. Placeholders that need your words

Every placeholder reads [MICHAEL: what is needed]. `npm run check:writing -- --placeholders` prints the current list. Grouped by page:

### Accessibility statement, manual passes (src/data/a11y-log.ts)

- data/a11y-log.ts, line 68: date of your first NVDA pass
- data/a11y-log.ts, line 71: what you found, in a line

### Blog category descriptions (src/lib/taxonomy.ts)

- lib/taxonomy.ts, line 26: one paragraph on this category: sight loss, the medical story, the emotional side, and the practical business of building a good life without sight
- lib/taxonomy.ts, line 33: one paragraph on how you actually work as a blind developer: screen readers, terminals, Claude Code, testing by ear
- lib/taxonomy.ts, line 40: one paragraph on the Life category: your girlfriend, family, Fort Wayne, food, the ordinary days
- lib/taxonomy.ts, line 47: one paragraph on AI and automation work: Claude as a bounded, logged step, pipelines, GoHighLevel and A2P, what worked and what did not
- lib/taxonomy.ts, line 54: one paragraph on the Programming category: Next.js, Astro, Supabase, TypeScript, the hosting and Linux years
- lib/taxonomy.ts, line 61: one paragraph on SEO and marketing: contractor marketing, Search Console, technical SEO, the agency side
- lib/taxonomy.ts, line 68: one or two sentences on the Build Log: short dated notes on what shipped across your projects
- lib/taxonomy.ts, line 75: one paragraph on fantasy football: twenty seasons of dynasty, superflex and tight end premium, FF Beacon, playing by ear
- lib/taxonomy.ts, line 82: one paragraph on the Packers and the NFL: Green Bay first, the league second, how a blind fan follows a game

### Blog posts (src/content/posts, all drafts)

- content/posts/build-log-1/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/build-log-1/index.mdx, line 2: Build Log entry 1: what shipped, in one line
- content/posts/build-log-1/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/build-log-2/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/build-log-2/index.mdx, line 2: Build Log entry 2: what shipped, in one line
- content/posts/build-log-2/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/build-log-3/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/build-log-3/index.mdx, line 2: Build Log entry 3: what shipped, in one line
- content/posts/build-log-3/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/build-log-4/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/build-log-4/index.mdx, line 2: Build Log entry 4: what shipped, in one line
- content/posts/build-log-4/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/build-log-5/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/build-log-5/index.mdx, line 2: Build Log entry 5: what shipped, in one line
- content/posts/build-log-5/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/dev-pipeline-sample/index.mdx, line 46: confirm this description with someone who was there. Michael from the shoulders up, smiling with his teeth showing, short dark hair brushed up and back, a full dark beard, a black collared shirt, outdoors beside a river with trees turning autumn colors and a cloudy sky; someone's arm rests across his shoulders from the right.
- content/posts/how-i-write-code-i-cannot-see/index.mdx, line 15: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/how-i-write-code-i-cannot-see/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/life-post-one/index.mdx, line 10: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/life-post-one/index.mdx, line 2: title of a short Life post, your choice of subject
- content/posts/life-post-one/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/my-screen-reader-setup-in-2026/index.mdx, line 15: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/my-screen-reader-setup-in-2026/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/packers-launch-week/index.mdx, line 10: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/packers-launch-week/index.mdx, line 2: Packers post for launch week, whatever the Packers just did
- content/posts/packers-launch-week/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/seven-years-running-a-hosting-company/index.mdx, line 15: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/seven-years-running-a-hosting-company/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/the-day-i-called-my-first-uber/index.mdx, line 12: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/the-day-i-called-my-first-uber/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/twenty-five-pipelines-one-credit-card/index.mdx, line 15: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/twenty-five-pipelines-one-credit-card/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/twenty-seasons-of-playing-by-ear/index.mdx, line 10: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/twenty-seasons-of-playing-by-ear/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/using-claude-as-a-logged-step/index.mdx, line 15: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/using-claude-as-a-logged-step/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/what-69885-impressions-taught-me/index.mdx, line 17: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/what-69885-impressions-taught-me/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards
- content/posts/what-i-wish-the-ophthalmologist-had-said/index.mdx, line 10: the post, in your words, from the interview transcript. Plain sentences, physical detail, dialogue where it happened, what did not work as well as what did.
- content/posts/what-i-wish-the-ophthalmologist-had-said/index.mdx, line 3: 120 to 160 characters describing this post, for search results and cards

### Components: components/content/ChapterRail.astro

- components/content/ChapterRail.astro, line 42: one line for the rail about chapters still to come, or nothing

### Home page (src/components/home)

- components/home/Dark.astro, line 14: the quiet second line. Something like what the first sentence of the memoir does.
- components/home/Day.astro, line 36: one line inviting people to write, in your words.
- components/home/Dusk.astro, line 66: one real number for {project.data.title}, with its source

### Now page entry (src/content/now)

- content/now/2026-10.mdx, line 12: books, podcasts, audio
- content/now/2026-10.mdx, line 16: the dated changelog line for this month
- content/now/2026-10.mdx, line 8: what you are building this month

### Pages (src/pages): blog/index.astro

- pages/blog/index.astro, line 33: two sentences introducing the blog in your words: what you write about and why

### Pages (src/pages): colophon.astro

- pages/colophon.astro, line 111: say whether the repository is public and link it, or remove this section

### Pages (src/pages): contact.astro

- pages/contact.astro, line 31: the public email address you want shown here

### Pages (src/pages): story/[chapter].astro

- pages/story/[chapter].astro, line 121: a line for the end of the latest chapter, or nothing

### Pages (src/pages): uses.astro

- pages/uses.astro, line 84: {s.prompt}

### Project pages (src/content/projects)

- content/projects/dynasty-price-check/index.mdx, line 18: what problem Dynasty Price Check set out to solve, in your words
- content/projects/dynasty-price-check/index.mdx, line 22: what you built and how, with the decisions that mattered
- content/projects/dynasty-price-check/index.mdx, line 26: what worked, what did not, and what you would do differently
- content/projects/dynasty-price-check/index.mdx, line 3: 120 to 160 characters describing Dynasty Price Check, for search results and cards
- content/projects/dynasty-price-check/index.mdx, line 4: one line on what Dynasty Price Check does
- content/projects/dynasty-price-check/index.mdx, line 7: year
- content/projects/ff-beacon/index.mdx, line 12: what it does in FF Beacon
- content/projects/ff-beacon/index.mdx, line 14: what it does in FF Beacon
- content/projects/ff-beacon/index.mdx, line 16: hosting, cron, functions
- content/projects/ff-beacon/index.mdx, line 34: what problem FF Beacon set out to solve, in your words
- content/projects/ff-beacon/index.mdx, line 38: what you built and how, with the decisions that mattered
- content/projects/ff-beacon/index.mdx, line 3: 120 to 160 characters describing FF Beacon, for search results and cards
- content/projects/ff-beacon/index.mdx, line 42: what worked, what did not, and what you would do differently
- content/projects/ff-beacon/index.mdx, line 4: one line on what FF Beacon is, for the projects grid
- content/projects/ff-beacon/index.mdx, line 7: year started
- content/projects/gridiron-sites/index.mdx, line 12: what it does here
- content/projects/gridiron-sites/index.mdx, line 25: what problem Gridiron Sites set out to solve, in your words
- content/projects/gridiron-sites/index.mdx, line 29: what you built and how, with the decisions that mattered
- content/projects/gridiron-sites/index.mdx, line 33: what worked, what did not, and what you would do differently
- content/projects/gridiron-sites/index.mdx, line 3: 120 to 160 characters describing Gridiron Sites, for search results and cards
- content/projects/gridiron-sites/index.mdx, line 4: one line on what Gridiron Sites is
- content/projects/gridiron-sites/index.mdx, line 7: year started
- content/projects/hoststing/index.mdx, line 11: the platform, in a few words
- content/projects/hoststing/index.mdx, line 19: what problem Hoststing LLC set out to solve, in your words
- content/projects/hoststing/index.mdx, line 23: what you built and how, with the decisions that mattered
- content/projects/hoststing/index.mdx, line 27: what worked, what did not, and what you would do differently
- content/projects/hoststing/index.mdx, line 3: 120 to 160 characters describing Hoststing LLC, for search results and cards
- content/projects/mjwalsh-net/index.mdx, line 28: what problem mjwalsh.net set out to solve, in your words
- content/projects/mjwalsh-net/index.mdx, line 32: what you built and how, with the decisions that mattered
- content/projects/mjwalsh-net/index.mdx, line 36: what worked, what did not, and what you would do differently
- content/projects/mjwalsh-net/index.mdx, line 3: 120 to 160 characters describing mjwalsh.net, for search results and cards

### Resume (src/data/resume.ts)

- data/resume.ts, line 106: your words. On record: SEO across a network of sites, distributed server infrastructure, high-traffic ecommerce platforms, internal IT.
- data/resume.ts, line 115: what you did at Kualo
- data/resume.ts, line 124: what you did at A Small Orange
- data/resume.ts, line 134: your words. On record: internal billing, HR and server automation systems.
- data/resume.ts, line 144: your words. On record: primary designer and full-stack developer for client projects.
- data/resume.ts, line 154: your words. On record: internal employee management, billing and support platforms.
- data/resume.ts, line 163: what Level 3 support meant at Hostgator
- data/resume.ts, line 169: the year you turned 14
- data/resume.ts, line 172: the freelance years from age 14 until Hostgator, and alongside it: what kind of work, for whom, in your words
- data/resume.ts, line 186: skill group, for example Full-stack development
- data/resume.ts, line 187: the tools and languages you would put under it
- data/resume.ts, line 190: skill group, for example Hosting and Linux
- data/resume.ts, line 191: keywords
- data/resume.ts, line 194: skill group, for example Automation and AI
- data/resume.ts, line 195: keywords
- data/resume.ts, line 198: skill group, for example SEO and marketing technology
- data/resume.ts, line 199: keywords
- data/resume.ts, line 206: one line on FF Beacon for the resume
- data/resume.ts, line 212: one line on Gridiron Sites for the resume
- data/resume.ts, line 24: the email address you want on the resume
- data/resume.ts, line 27: three or four sentences in your own words: twenty years in software counting freelance work since you were 14, two Director of Technology roles, a hosting company you founded and sold, and what you do now at JWeis. Say plainly that you are open to Director of Technology and full-stack roles.
- data/resume.ts, line 45: what you actually do at JWeis now, in your words
- data/resume.ts, line 47: one concrete thing you built or run at JWeis, with a real number if you have one
- data/resume.ts, line 57: your words. The facts on record: vision problems through 2022, a brain tumor found in October 2022, a craniotomy, sight lost as a complication of the tumor and the surgery, two years spent recovering and relearning how to live blind.
- data/resume.ts, line 66: what you did at BigScoots
- data/resume.ts, line 76: the Hoststing story in a few sentences: a Linux web hosting company you founded and ran for seven years with a global team of developers and support engineers, sold in a private sale to GlowHost together with its sister company cutalltheshit.com under the same LLC
- data/resume.ts, line 77: a real number or two: customers, servers, uptime, team size
- data/resume.ts, line 85: what you ran and built as Director of Technology at JWeis
- data/resume.ts, line 96: your words. On record: headless WordPress with Vue and Nuxt, and a proprietary learning management system.

### The story, chapter one frontmatter (src/content/story)

- content/story/01-through-darkness-and-light.mdx, line 4: one line that says what chapter one covers, for the chapter rail
- content/story/01-through-darkness-and-light.mdx, line 5: the months or years chapter one covers, for example 2021 to 2022
- content/story/01-through-darkness-and-light.mdx, line 7: a description of 120 to 160 characters for search results and social cards

Total: 126. The home page Dusk section also shows "one real number with its source" for each project that has no stat yet; those resolve when the project frontmatter gets its numbers.

## 2. Environment variables and where each is used

Copy .env.example to .env for local work. Production values go in the Vercel project settings. Every feature runs without its key: the code logs one line and degrades as described.

- SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY: src/lib/server/supabase.ts (publicClient) and src/lib/metrics for the build-time read of site_metrics_public; scripts/snapshot-metrics.ts. Without them the build uses src/data/metrics-snapshot.json and says so.
- SUPABASE_SECRET_KEY: src/lib/server/supabase.ts (secretClient), used by src/pages/api/contact.ts (rate limit and backup row), src/pages/api/subscribe.ts (subscriber mirror) and src/pages/api/metrics.ts (upsert). Server only. Without it those writes are skipped.
- RESEND_API_KEY and CONTACT_TO_EMAIL: src/pages/api/contact.ts. Without them messages are stored in Supabase only; without Supabase too, the form answers "not connected yet" and nothing is lost silently.
- TURNSTILE_SECRET_KEY and PUBLIC_TURNSTILE_SITE_KEY: src/pages/api/contact.ts and src/components/islands/ContactForm.astro. Without them the widget is not rendered and the honeypot plus rate limit stand alone.
- BUTTONDOWN_API_KEY: src/pages/api/subscribe.ts. Without it the form says the newsletter is not live yet.
- GSC_SERVICE_ACCOUNT_JSON: src/pages/api/metrics.ts, the whole service account JSON on one line. The account needs read access to the ffbeacon.com property in Search Console. Without it the Search Console figures are not refreshed.
- CRON_SECRET: src/pages/api/metrics.ts refuses every call without it; Vercel sends it as a bearer token with the cron. It also salts the contact form IP hash.
- VERCEL_DEPLOY_HOOK_URL: src/pages/api/metrics.ts posts to it after a successful refresh so the new numbers are baked into the pages.
- INDEXNOW_KEY: reserved for the post-deploy ping (Phase 5). The key file goes in public/ under the key name.
- PUBLIC_SITE_URL: src/lib/site.ts, canonical URLs, feeds and the analytics host check. Defaults to https://mjwalsh.net.
- PUBLIC_GA_MEASUREMENT_ID: src/components/site/Analytics.astro. Defaults to G-1HNN2M5MQ1, which is public. The tag loads only on the production host or with ?analytics=on.

## 3. Adding the keys and connecting Vercel

1. In the Vercel dashboard, create the project from the GitHub repository. Framework: Astro. Build command: npm run build. Output is the Build Output API folder the adapter writes; no override is needed. Node version 22.
2. Add the mjwalsh.net domain and the www redirect to it. The code assumes trailing slashes are never used; vercel.json sets that.
3. Create a deploy hook (Settings, Git, Deploy Hooks) for the production branch and copy its URL into VERCEL_DEPLOY_HOOK_URL.
4. Add every variable from section 2 in Settings, Environment Variables. Vercel generates CRON_SECRET for you if you add a cron; otherwise set any long random string. The cron in vercel.json calls /api/metrics every day at 06:00 UTC.
5. Supabase: the migrations are already applied to the Mjwalsh.net project (ref kavssklkhapzsdvkuwii). Copy the project URL, the publishable key and the secret key from the API settings into the three variables. New key names only.
6. Resend: verify the mjwalsh.net domain in Resend so mail can be sent from no-reply@mjwalsh.net, then create an API key and set CONTACT_TO_EMAIL to the address you want messages at.
7. Turnstile: create a widget for mjwalsh.net in the Cloudflare dashboard and copy the site key and secret key.
8. Buttondown: create the newsletter and copy the API key.
9. Search Console: create a service account in Google Cloud, give its email read access to the ffbeacon.com property, download its JSON key, and paste the JSON on one line into GSC_SERVICE_ACCOUNT_JSON.
10. Giscus: turn on Discussions in the repository, run through giscus.app, and put the four values into GISCUS in src/lib/site.ts. They are public, not secrets.
11. Webmentions: sign in at webmention.io with the site (it needs the rel="me" links, which are in the footer) so mentions start arriving; the head already carries the webmention link.
12. Google Analytics: set data retention to 14 months in the property admin, and link Search Console at launch.
13. Push to main. CI runs the whole suite on GitHub; Vercel builds from the same commit. The code is already on main as of 2026-10-21, so connecting the repository in Vercel is enough for the first build.

## 4. Commands

- npm install, then npx supabase login and npx supabase link --project-ref kavssklkhapzsdvkuwii once per machine.
- npm run dev: the development server with drafts and the /dev pages.
- npm run build: the production build (drafts and /dev excluded). npm run build:test: the build the suites use, with drafts and /dev included.
- npm run preview: serves the last build at http://localhost:4321 the way Vercel will, functions included.
- npm run verify: writing check, lint, types, unit tests. This is what the pre-commit hook partly runs (the writing check) on every commit.
- npm run test: unit tests (Vitest). npm run test:a11y: axe, keyboard and feature tests (Playwright, needs a build:test first). npm run test:e2e: the size budgets. npm run lhci: Lighthouse CI on every route.
- npm run check:html: html-validate over the built pages. npm run check:contrast: the token and arc sampler. npm run check:writing: the writing checker; add --placeholders to list every placeholder.
- npm run build:pdf: regenerate resume.pdf from the built resume page (run after editing src/data/resume.ts, then commit public/resume.pdf). npm run capture:screenshots: recapture the project screenshots.
- npx tsx scripts/snapshot-metrics.ts: refresh the committed metrics snapshot from Supabase.
- npm run db:new, db:push, db:types: Supabase migrations and types, as before.

## 5. Manual testing checklist (section 9.4)

Log each pass with its date in src/data/a11y-log.ts under manualPasses, and each bug fixed under fixLog.

- Full keyboard pass of every page: tab order, visible focus on both grounds, Escape closes the search and the reading dialog, no traps. Pages: home, story, chapter one, about, resume, projects and the five project pages, blog, a category, a series, the sample post (in a build:test), now, uses, accessibility, contact, colophon, privacy, keyboard.
- NVDA with Firefox and Chrome on Windows: the header reads "Michael Walsh, home" once; landmarks announce; the search dialog announces results counts; the reading dialog; the chapter rail; the contact form errors; the audio controls and the synthetic read-aloud button; the "what my screen reader hears" view matches what NVDA says.
- VoiceOver on iPhone Safari: the same pages on a phone, with the nav wrapping onto two rows.
- 200 percent and 400 percent zoom in Chrome: no horizontal scrolling, nothing clipped, the reading controls at 200 percent text on top of zoom.
- Windows High Contrast: borders and focus remain, the braille mark keeps its outline, the dark home movements stay readable.
- Reduced motion on: the home ground does not move; the bands are static gradients.
- The screen reader view on every page, compared with NVDA.
- The contact form with keys set: a real message arrives by mail and in Supabase; the Turnstile widget works by keyboard.
- The newsletter form with the Buttondown key set: a confirmation mail arrives.
- Print the resume page to PDF from the browser and compare with /resume.pdf.

## 6. Things the build could not do, for your list

- Sleeper leagues synced this season: no source this site can reach. If FF Beacon exposes a count (a view or an endpoint), add a provider in src/pages/api/metrics.ts next to searchConsole.
- The FF Beacon impressions figure in the snapshot is 73,908, pulled by hand from Search Console on 2026-10-21. The metrics job keeps it current once the service account exists. The SEO post's draft title and folder still say 69,885 from the plan; change the title to the live number on the day it is published.
- No recording exists yet, so listen mode offers only the synthetic voice. Add audio to a chapter or post's frontmatter (src, voice, duration) and drop the file in public/audio.
- The NVDA pass of the primitives is yours; the automated checks stand in until then.
- pa11y-ci from the plan is not installed; axe through Playwright, html-validate and Lighthouse cover the same ground. Add it in Phase 5 if you want the second opinion.
- Lighthouse's lab LCP is a warning rather than an error, for the reason recorded in docs/progress.md; every route reads under 2.0 s with the compressing server, and the field number comes from Speed Insights.

## 7. Where things stand for the next session

- Phases 1 to 4 are built. Phase 0 keyword research is done: docs/content-topics.md has the topic map, a target search for each launch post and the next steps from it. Two searches were not checked: "Michael Walsh JWeis" and the hosting-company post topic.
- Still yours from Phase 0: the interviews, the portrait description, docs/content-voice.md with its five examples, and the 126 placeholders in section 1.
- The one new post the research suggests: a Building Blind comparison of Sleeper, ESPN, Yahoo and NFL Fantasy with a screen reader.
- npm run dev did not start for you on 2026-10-21. Here, npx astro dev started and served / and /blog at http://localhost:4321. If it still fails, the output of npm run dev and node --version will show why.
- Next: add the keys (section 3), then the manual pass (section 5), then Phase 5 in the plan.
