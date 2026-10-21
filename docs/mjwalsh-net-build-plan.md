# mjwalsh.net build plan

Written 2026-10-20. Revised 2026-10-21 with Michael's answers to the first draft's fourteen questions. Status as of the end of 2026-10-21: Phases 1 to 4 are built and pushed to main, and the Phase 0 keyword research is done (docs/content-topics.md). docs/progress.md records each task and docs/handoff.md lists what is left for Michael before Phase 5.

This file is the technical plan. The companion artifact (the visual pitch) explains the same ideas in plain terms with mockups. When the two disagree, this file wins.

What changed in this revision, in one list:

- Hosting moves from Cloudflare Workers to Vercel. Michael already has a Pro plan there and uses it for every other project. He is setting up the Vercel project, domains and deploy hook himself; this plan only lists what the code needs from them. Astro, Supabase and Resend stay.
- Analytics is Google Analytics 4. The property exists as of 2026-10-21 (section 10.4 has the IDs).
- Work history now comes from Michael's LinkedIn profile, read while logged in on 2026-10-21, instead of an unverified ZoomInfo listing. The full list goes back to Hostgator in 2009, and Michael adds freelance development work from age 14, which is where "twenty years" comes from.
- The five follow-up questions from the first revision are answered (section 14 is now a decisions log and Michael's own task list). Redirecting traversingdarkness.com is his task, not part of the build.
- Three new blog categories from Michael's interests: AI, the Green Bay Packers and the NFL, and Life. Programming gets its own category too.
- Every word of site copy is first person. "I" and "my" everywhere Michael speaks. "Michael" only when someone else refers to him, in schema, and in the author box.
- The Traversing Darkness name stays as the memoir category, and traversingdarkness.com redirects here.
- No client case studies. The projects page shows only Michael's own work.
- Audio narration is in: Michael's own recordings, a voice actor from Fiverr, or a synthetic voice, labeled as whichever it is.
- The photo is the one already on ffbeacon.com.
- Newsletter and comments are on at launch.
- The header reads "Michael Walsh" next to the braille mark.
- The ember accent in light mode is approved.

## 1. What this site is

mjwalsh.net is Michael Walsh's personal site. It does four jobs at once:

- It tells the story of losing his sight at 34 to a brain tumor and what came after. The Traversing Darkness idea started as its own domain and now lives here.
- It shows his work: freelance development since he was 14, employed roles since 2009 (Hostgator first, then a run of hosting, systems and full-stack jobs), Director of Technology twice, founder of Hoststing LLC (sold with its sister company to GlowHost), and since October 2024 full-stack developer and automation and AI specialist at JWeis Marketing. On his own time he built FF Beacon and Gridiron Sites.
- It hosts a real blog with categories that follow his interests, written in his own voice.
- It proves a point by existing: a blind developer can ship a site that sighted visitors call beautiful and screen reader users call the best-built page they have used all week.

The fourth job is the one that makes the site different from every other developer portfolio. Most personal sites treat accessibility as a checklist. This one treats it as the subject. Every visual decision gets a written equivalent, every interaction works by keyboard first, and the site explains its own construction as content.

The site speaks in Michael's first person. The plan refers to him in the third person because it is written for both of us; the site never does.

## 2. Audiences and what each one needs

- Hiring managers, clients and partners. They need the resume, the project proof with real numbers, and a fast way to make contact. They will spend ninety seconds. The home page has to answer "who is this and what has he shipped" above the fold.
- Blind and low-vision readers. They need a site that is a pleasure to use with NVDA, JAWS, VoiceOver and TalkBack. They will tell other people about it if it is.
- People going through sight loss, and their families. They need the story, told straight, with the practical parts (how he kept working, what tools he uses) easy to find.
- Fantasy football players who found FF Beacon, and Packers fans who found the blog. They need the football writing and the story behind the product.
- Developers and marketers who want to learn how he builds with Claude Code, automations, Supabase and SEO. They need the technical writing and the uses page.
- Search engines and AI answer engines. They need clean structure, schema, an author entity, and an obvious topical focus so the site becomes the canonical source for "Michael Walsh, blind developer".

## 3. Why it will stand out

Four things, in order of importance.

1. The story is true and specific. The my-story draft already has the details that make writing land: the 9 a.m. desk in the living room, chicken and broccoli from Bamboo Spice, the ophthalmologist Googling on his phone, the neurologist asking "Did you drive here?". No AI-written personal site has material like this because no AI lived it. The plan protects that voice (section 7).

2. The site is the demo. Visitors can switch on a "what my screen reader hears" view and read the page as a linear stream, the way Michael does. Every image has a long description. Every chart has a text table. The accessibility statement page lists the real test process and the real bugs fixed, with dates. Nobody else's portfolio can do this honestly.

3. The design has one idea and commits to it: the page moves from darkness to light. The home page opens in near-black with large editorial type and, as the story scrolls forward, the ground lightens to paper. It is the arc of the memoir turned into a layout. It also sidesteps the generic dark-mode-developer-portfolio look because the darkness is a beginning, not a theme.

4. Every number is real and sourced. FF Beacon's Search Console impressions, the number of Sleeper leagues synced, the count of automated tests. The site reads these from a database that scheduled jobs keep current, and shows the source and date next to each figure. This is already how Michael builds products; the personal site follows the same rule.

## 4. Site map and content architecture

### 4.1 Top-level routes

- / Home. The dark-to-light scroll: who I am, the three or four things I am proudest of, the latest writing, a short "now" strip, and contact.
- /story The long-form About. The memoir in chapters, with a keyboard-navigable chapter timeline. Chapter one is the existing draft (edited by Michael). Later chapters arrive as he writes them.
- /about A short, practical bio for people who do not want the memoir: what I do, where, how I work, the photo with a full description, links.
- /resume Work history, expertise, skills, education. Print stylesheet. Downloadable PDF and a machine-readable JSON Resume file.
- /projects Index of my own projects with real screenshots and real numbers.
- /projects/[slug] One page per project: the problem, what I built, stack, numbers with sources, lessons, links.
- /blog Index with category filter, search, and feed links.
- /blog/[slug] Posts (MDX).
- /blog/category/[category] One index per category.
- /blog/series/[series] Optional multi-part series (the memoir chapters also publish as a series).
- /now What I am working on this month, updated monthly, with a dated changelog.
- /uses The tools of a blind developer: screen reader, keyboard, editor, terminal, Claude Code setup, hardware, the hooks that turn markdown into plain text. This page will rank; "blind developer setup" searches have almost no good answers.
- /accessibility The accessibility statement: conformance target, how the site is tested, known issues, how to report a problem, and a dated fix log.
- /contact Form plus direct email, plus a short note on response time.
- /colophon How the site is built, fonts, stack, and the AI disclosure (what tools were used and the rule that every word was written or edited by me).
- /privacy What is collected and by whom, in plain words, including Google Analytics.
- /feed.xml, /feed.json, /sitemap.xml, /robots.txt, /llms.txt, /resume.json, /resume.pdf.
- /keyboard Keyboard shortcuts reference (also reachable with the ? key).

### 4.2 Blog categories

Nine categories, confirmed from Michael's own list of interests on 2026-10-21: AI (using it, building with it, automating with it), the Green Bay Packers and NFL football, fantasy football, life with his girlfriend and family, work (programming, SEO, automation), and making life as a blind person as good as it can be.

Each category gets its own index page, a one-paragraph description in Michael's words, and a feed. The blog index groups them under three headings so nine does not feel like a wall.

Under "The story":

- Traversing Darkness. Sight loss, the medical story, the emotional side, and the practical business of building a good life without sight. This is the memoir home and the reason the site exists.
- Building Blind. How a blind developer actually works: screen readers, terminals, Claude Code, testing by ear, the accessibility bugs that only a blind user notices.
- Life. My girlfriend, family, Fort Wayne, food, the ordinary days. Short posts, no agenda.

Under "The work":

- AI and Automation. Using Claude as a bounded, logged step inside a system, fine-tuning and prompt design that held up in production, GoHighLevel and A2P work, scheduled pipelines, what worked and what did not.
- Programming. Next.js, Astro, Supabase, TypeScript, the hosting and Linux years, patterns and mistakes.
- SEO and Marketing. Contractor marketing, Search Console, technical SEO, the agency side of the job.
- Build Log. Short, dated notes on what shipped across my projects. Low effort, high frequency, good for return visits and freshness signals.

Under "Football":

- Fantasy Football. Twenty seasons of dynasty, superflex and tight end premium; FF Beacon design decisions; data and projections; the "play by ear" approach to stats.
- Packers and the NFL. Green Bay first, the league second. Game reactions, roster takes, the draft, and how a blind fan follows a game.

Tags stay free-form and lowercase for cross-cutting topics (nvda, supabase, sleeper, draft, recipes).

### 4.3 Content model

Every piece of content is a file in the repo, versioned in git, written in MDX with typed frontmatter. The frontmatter schema is enforced at build time so a missing description or a bad date fails the build rather than shipping.

Post frontmatter:

```
title
description (120 to 160 characters, used for meta and cards)
date
updated (optional)
category (one of the nine slugs)
series and seriesOrder (optional)
tags (free, lowercase)
draft (boolean; drafts build locally only)
hero (optional image path)
heroAlt (required if hero is set)
heroDescription (optional long description, rendered under a disclosure)
audio (optional: { src, voice: "michael" | "actor" | "synthetic", duration })
canonical (optional, for anything first published elsewhere)
```

Project frontmatter adds: url, role (list), year, stack (list of name and use), stats (list of value, label, source, asOf), gallery (list of src, alt, kind, caption, longDescription).

Resume data lives in one typed file (src/data/resume.ts following the JSON Resume schema) and renders the HTML page, the PDF and the JSON endpoint from the same source, so they can never drift. Section 7.5 has the facts that file starts from.

Live numbers (section 6.6) live in Supabase and are read at build time with a fallback to the last committed snapshot, so a database outage never breaks a deploy.

## 5. Design direction

### 5.1 The idea: darkness to light

The memoir draft opens with "It's funny how life has a way of playing with symbolism. The beginning of this chapter in my life was shrouded in darkness, and so was the end, though the two kinds of darkness could not have been more different." The site takes that literally.

The home page is one long scroll in four movements:

1. Dark. Near-black ground, a single large statement in display type, a quiet secondary line. No hero image. No buttons in a row. The nav is present and the skip link is the first focusable element.
2. Dusk. The ground lifts to a deep warm gray as the "what I have shipped" section arrives: three or four projects as large editorial blocks with real screenshots and one real number each.
3. Dawn. The ground reaches paper as the writing section appears: latest posts, grouped by category, with reading time.
4. Day. Full paper for "now" and contact.

Implementation: each movement is its own section with its own background token, so with motion off the page is simply four sections that step from dark to light. With motion on, a CSS scroll-driven animation interpolates the ground color between sections. The text color follows the same curve, and every intermediate state is checked for 4.5:1 contrast by a build-time script that samples the interpolation at ten points. This is the one place the site takes a visual risk, and it degrades to nothing worse than a well-spaced page.

Every other page is single-ground and follows the visitor's light or dark preference, with a visible toggle in the header that persists.

### 5.2 Tokens

Colors (final values are set during Phase 1 and tested for contrast; these are the starting points):

- ink: a near-black with a slight warm bias, used as the dark ground and the light-theme text.
- paper: a warm off-white that is not the standard cream-and-terracotta default. Aim slightly cooler and brighter than Gridiron Sites' cream so the two brands are distinct.
- lamp: the single accent on dark grounds. A warm amber (#D9941F as the starting value, 7.3:1 against ink), the color of a light left on in a dark room. It is used for links, focus rings, the active nav marker, and small rules. Never for large fills.
- ember: the same hue darkened for light grounds (#73420A, 7.1:1 against paper). Raw lamp on paper only reaches 2.3:1, so the light theme uses ember for any text or focus ring. Approved by Michael on 2026-10-21.
- smoke: the mid gray for borders and secondary text, derived from ink with the same warm bias (#5E5A54 on paper, 6.1:1; #B3ADA3 on ink, 8.4:1).
- signal: a reserved semantic color for form success and error states, separate from the accent.

Starting values: ink #141210, paper #F6F2EA (16.7:1 against ink). All ratios computed from these exact values; the Phase 1 contrast test re-checks every pair in both themes.

Both themes get the same care. Dark theme is not an inversion: paper text on ink is slightly reduced in weight and the lamp accent is desaturated a step so it does not glow.

Typography:

- Display: Fraunces (variable, with optical size and the "wonk" axis), used for page titles and the home page statements. It has character without looking like a template.
- Body: Atkinson Hyperlegible Next. Designed by the Braille Institute for low-vision legibility, which is exactly the right story for this site and a genuinely good reading face. It also distinguishes similar letterforms (I, l, 1; O, 0), which helps every reader.
- Mono: JetBrains Mono for code, stats, dates, and eyebrow labels.
- Type scale: a fixed modular scale with fluid sizes between 360 px and 1440 px, body at 18 px minimum on desktop, line length capped near 65 characters, line height 1.6 for body. Headings use text-wrap: balance, paragraphs use text-wrap: pretty.

The header and the mark:

- The header's home link is the braille mark followed by "Michael Walsh" set in Fraunces. The mark is decorative (aria-hidden) and the link's accessible name is "Michael Walsh, home", so a screen reader hears the name once, not "image, Michael Walsh, Michael Walsh".
- On the dark movement of the home page the mark's dots are lamp-colored; everywhere else they take the text color.
- The logo mark is the braille cells for M (dots 1, 3, 4) and W (dots 2, 4, 5, 6) drawn as a six-dot grid. It is the favicon, the loading mark, and the section separator. It means something, it is unique to this owner, and it reads at 16 px.
- Dot grids derived from the cell appear faintly behind the "Building Blind" category and the accessibility statement. Never behind body text.
- Rules and eyebrows carry real information: a post's category and reading time, a project's year and role, never decorative numbering.
- The footer carries a place line, "Fort Wayne, Indiana", with the local time. The story's Houston years are in the story.

### 5.3 Patterns this site never uses

These are the patterns Michael rejected on Gridiron Sites and the ones that mark a page as machine-generated. Any component that matches one gets redesigned before review.

- A small pill status badge above the headline.
- A centered hero with two gradient buttons side by side.
- Three feature cards with an icon in a rounded box.
- Dark navy with blue-to-purple gradients.
- A purple-to-blue gradient hero on white.
- Cream background with serif and terracotta (the current default look).
- Inter or Space Grotesk as the "safe" face.
- Everything centered.
- The same rounded corner and shadow on every block.
- Emoji as section markers.
- Numbered 01 / 02 / 03 markers on content that is not a sequence.
- Cursor-following blobs, particle fields, or 3D hero scenes.

### 5.4 Reference sites

Twelve live personal sites, each opened and screenshotted during research on 2026-10-20. Ten to borrow one idea from, two to study as warnings. None is a template for mjwalsh.net; the design in 5.1 is its own.

1. brittanychiang.com. Brittany Chiang, front-end engineer at Klaviyo, whose tagline is "I build accessible, pixel-perfect experiences for the web." A fixed left column (name, title, a three-item nav whose line markers lengthen for the active section) beside a scrolling right column with a dated experience timeline and tagged stacks. Borrow: the fixed rail plus scrolling content for the chapter rail on /story, and the tagged timeline shape for /resume.
2. joshwcomeau.com. Josh Comeau, educator. One warm hero illustration (rows of colored dashes that bend toward the cursor) above a disciplined two-column article layout, with sound and dark-mode toggles in the header and page changes through the View Transitions API. Borrow: one memorable set piece, then calm; visitor-choice toggles in the header.
3. paco.me. Paco Coursey, Linear. Near-black, small type, an italic serif opening line, a three-column index of Building, Projects and Writing, a Now paragraph, and a page built to work with JavaScript off. Borrow: typography as the whole design; the Now paragraph on the home page.
4. leerob.com. Lee Robinson. Set entirely in a serif, with evergreen "Notes" separated from dated posts, a Default or Long bio toggle, and one illustration providing all the color. Borrow: the notes-versus-posts split (Uses and Accessibility are notes) and the short-or-long bio toggle for /about.
5. blog.maximeheckel.com. Maxime Heckel. One saturated brand color at full strength in the hero and nowhere else, an archive grouped by year, a floating nav with a command palette. Borrow: discipline about where the accent appears; the year-grouped archive.
6. antfu.me. Anthony Fu. A narrow plain-text column where every project name carries its tiny logo inline, so a paragraph reads as proof. Borrow: inline marks beside FF Beacon, Gridiron Sites and JWeis in the bio.
7. hakim.se. Hakim El Hattab, author of reveal.js. One large bold sentence as the hero with a single linked word, then a scannable grid of experiments, each a title and one line, and no nav bar at all. Borrow: the one-sentence hero for the Dark movement; the one-line grid for /projects.
8. adhamdannaway.com. Adham Dannaway. A portrait split down the middle, a painted "designer" half and a photographed "coder" half, each linking to its section. Borrow: the two-identities idea, expressed in words here: the story and the work as the two halves of the home page.
9. robbowen.digital. Robb Owen, Wales. Pale, serif-led and illustrated, with a Welsh footer line meaning "made in South Wales" and a skip link. Borrow: distinctive does not have to mean dark or 3D; the place line in the footer.
10. maggieappleton.com. Maggie Appleton, the digital garden reference. Writing sorted by how settled it is (Essays, Notes, Patterns) with maturity labels, plus Now and About. Borrow: a maturity label on posts and the Now page convention.
11. bruno-simon.com (warning). A 3D driving game as a portfolio. Awwwards Site of the Month, January 2026, with an accessibility sub-score of 6.6, its lowest mark. The lesson is the invitation to explore, never the WebGL.
12. dennissnellenberg.com (warning). A preloader cycling "Hello" through languages, a marquee name, and a pill showing location with a live local time. Borrow the location and live time as a trust signal in the footer; the preloader and marquee stay out.

Trend notes from the same research, applied to this site:

- Adopt: editorial serif display type over readable sans body; dark mode designed rather than inverted, with every pair checked in both themes; the Now page and digital garden conventions; oversized real text instead of hero images; CSS scroll-driven animation only inside @supports (animation-timeline: scroll()) and prefers-reduced-motion: no-preference, since Firefox has not shipped it and will simply see the stepped version; cross-document view transitions by CSS alone; "machine experience" basics (semantic HTML, server-rendered pages, JSON-LD) so AI agents can read the site.
- Skip: bento grids (reading and focus order break when tiles restack on phones); glass surfaces behind text (no fixed contrast to test); cursor effects (they hide the user's enlarged or high-contrast pointer and count as motion); 3D hero scenes (bundle size, GPU load, and the lowest accessibility scores on the award sites); brutalism beyond a single accent; preloaders of any kind.

### 5.5 Motion rules

- All motion under 250 ms with ease-out, except the home scroll arc, which is tied to scroll position and has no duration.
- prefers-reduced-motion: reduce disables the scroll arc, all reveal-on-scroll, and the view transitions, leaving instant state changes. Reduced motion is also a user toggle in the footer for people whose OS setting is not set.
- Nothing autoplays. No video or audio starts without a button press.
- No parallax, no cursor effects, no scroll hijacking. Scroll position always belongs to the reader.

## 6. Signature features

Each of these is unique to this site, serves a real audience, and is accessible by design. They are ranked by value; the build phases (section 13) order them.

### 6.1 The dark-to-light home page

Described in 5.1. The one visual set piece.

### 6.2 "What my screen reader hears"

A toggle (in the footer and on /accessibility) that re-renders the current page as the linear text stream a screen reader produces: landmarks announced as "banner", "navigation", "main", headings announced with their level, links announced as "link", images read as their alt text, and so on. It is built from the real accessibility tree (the page's own DOM walked with the same rules browsers use for accessible names), so it is a true picture and it doubles as a QA tool for Michael. Sighted visitors learn in thirty seconds why alt text and heading order matter. Nobody else can show this with authority.

### 6.3 The story timeline

/story renders the memoir as chapters. A persistent chapter rail (a real nav landmark with aria-current) lets readers jump between chapters and shows progress. Each chapter has a date range, a one-line summary, and an optional narrated recording. On the home page, a compact version of the timeline (five or six beats) sits inside the "dusk" movement.

The beats are already on the record in Michael's own words on LinkedIn: vision problems during 2022, the brain tumor found in October 2022, a craniotomy, sight lost as a complication, two years of recovery and relearning how to live blind, and the return to JWeis in October 2024. Chapter one (the draft) ends at the neurologist calling for a wheelchair; the chapters after it cover the surgery, the clearer head that came after it, the recovery, the screen reader, and the return to work. Michael writes them; nothing in them is drafted for him.

### 6.4 Listen mode

Michael reads the memoir chapters and selected posts aloud, or has a voice actor from Fiverr or a synthetic voice do it. The audio player is a native audio element with custom, fully labeled controls, a transcript (the post itself), and keyboard shortcuts. The player states the voice source in its label ("Read by Michael", "Read by a voice actor", "Synthetic voice"), because a listener who thinks they are hearing the author and is not would be right to feel misled. Posts without a recording offer a browser read-aloud button using the Web Speech API, clearly labeled as synthetic.

### 6.5 Long descriptions on every image

Every image has alt text. Images that carry information (screenshots, charts) also get a long description under a "Describe this image" disclosure, visible to everyone. Charts render a data table in the same disclosure. The colophon explains the rule.

The photo. The site uses the portrait already published on ffbeacon.com, at C:\Users\mjwal\OneDrive\Desktop\ffbeacon\public\img\author\michael-ff-beacon-founder.jpg (57 KB, copied into this repo at Phase 1). Viewed on 2026-10-21, it shows Michael from the shoulders up, smiling with his teeth showing, short dark hair brushed up and back, a full dark beard, a black collared shirt, outdoors beside a river with trees turning autumn colors and a cloudy sky behind him; someone's arm rests across his shoulders from the right. Draft alt text: "Michael Walsh smiling, outdoors by a river in autumn." The long description expands on that, and Michael confirms it with someone who was there, because he may know the place and the person whose arm it is.

### 6.6 Live, sourced numbers

A small set of figures update themselves: FF Beacon Search Console clicks and impressions (last 90 days), Sleeper leagues synced this season, number of automated tests, days since the last post. A Vercel cron job calls a function that writes them to a Supabase table and then posts to the project's deploy hook, so the figures are baked into static HTML and need no JavaScript to display. Each figure shows its source and "as of" date. Reads stay under the 1000-row limit by design (one row per metric), and the fetch helper pages anyway.

### 6.7 Command palette and keyboard map

Ctrl+K (or /) opens a palette that searches posts and projects (Pagefind index, built at deploy, no server) and lists page actions. It is a proper dialog: focus trapped, Escape closes, results are a listbox with aria-activedescendant, and a screen reader hears result counts. The ? key opens the shortcuts reference. These are features sighted power users enjoy and blind users rely on.

### 6.8 Reading controls

A persistent "Reading" menu: text size (up to 200 percent without layout breakage), line spacing, a high-contrast mode beyond AA, a dyslexia-friendly spacing option, and the theme toggle. Settings persist in localStorage, with the page rendering correctly when storage is unavailable.

### 6.9 Resume in three formats

The HTML resume, a print stylesheet that produces a clean one or two page PDF (generated at build with Playwright so the PDF is always current), and /resume.json in the JSON Resume schema. A recruiter can take whichever they want.

### 6.10 The accessibility fix log

/accessibility includes a dated list of real accessibility bugs found and fixed on this site, with a sentence on how each was found (NVDA, keyboard pass, axe, a reader's email). It is a living document and it signals seriousness to the people who care most.

### 6.11 Build Log and the "now" strip

Short dated entries that take five minutes to write keep the site fresh between long posts. The home page shows the latest three. The /now page shows the current month and an archive.

### 6.12 Newsletter and comments, on at launch

Newsletter through Buttondown's free tier, with the form posting to a Vercel function so no third-party script loads on the page. Comments through Giscus (GitHub Discussions), loaded only on click so it costs nothing on first paint. Webmentions received through webmention.io and rendered at build. Michael confirmed both the newsletter and comments ship at launch; each stays switchable off per post.

## 7. Writing: voice, process, and rules

### 7.1 The voice, from the source

The my-story draft is the voice guide. What it does:

- Plain sentences, mostly short, with a longer one when the moment needs it. "I was 34 years old when I lost my sight to a brain tumor." Then a longer sentence that complicates it.
- Specific, physical detail instead of adjectives. The desk in the living room. Chicken and broccoli from Bamboo Spice at 6 p.m. The chair scraping the floor.
- Dry, understated humor that never asks for sympathy. "I should have panicked, but exhaustion dulled my reactions."
- Honest about the mistakes, including his own. "Still, I ignored it, convinced it would fix itself."
- Scenes with dialogue. "Did you drive here?" The doctors are shown, not described.
- Section breaks with short, plain titles. "The First Sign." "The Wrong Answers."
- First person, past tense for the story, present tense for the practical pages.

The technical and marketing writing should sound like the same person: direct, concrete, a little wry, willing to say what did not work.

First person is the rule for the whole site, confirmed 2026-10-21. Page copy, bios, project pages, the resume summary, button labels that refer to the author ("Email me", not "Email Michael"), and meta descriptions all use "I" and "my". The name "Michael Walsh" appears in the header, the author box under posts, the resume heading, page titles, schema, and anywhere a third party is quoted.

The LinkedIn descriptions are facts, not voice. They are written in the register the plan bans ("spearhead", "seamless", "leverage", "drive innovation"). The resume page keeps the titles, employers and dates from them and rewrites every sentence in the voice above, from an interview with Michael about what he actually did at each job.

### 7.2 Process that keeps the words his

1. The memoir is Michael's alone. He writes the chapters; the only editing is a pattern check and a typo pass he approves line by line.
2. For every other page and the first twelve posts, interview first. Michael talks through the subject (a voice memo or a recorded call). The transcript is the raw material.
3. Draft from the transcript, in his sentences, with his detail. Where the transcript is thin, the draft marks a gap with a question rather than filling it.
4. Michael edits every draft by ear. Nothing publishes without his pass.
5. Each piece gets the pattern check in 7.3 before review, and the reviewer states what was found and changed.
6. The colophon discloses the process in one paragraph.

### 7.3 Banned patterns

The house rule from Michael's global instructions, applied to every string on the site, down to button labels and alt text:

- No "not just X, it's Y" negative parallelism.
- No significance inflation ("in an era where", "underscoring").
- No puffery: seamless, robust, cutting-edge, elevate, unlock, harness, leverage, empower, streamline, transform, delve, tapestry, testament, journey (as a noun for a life), landscape, realm.
- No rule-of-three cadence as a reflex.
- No formulaic transitions: moreover, furthermore, additionally, ultimately, that said, it's worth noting.
- No vague authority: "experts agree", "studies show".
- No trailing participle clauses that add nothing.
- No bolded lead-ins restated by the sentence after them.
- No em dashes. No curly quotes. No ellipsis characters. No emoji.
- No Title Case headings.
- Vary sentence length on purpose. Put a short one next to a long one.
- Invent nothing. Every number, date, employer and claim comes from Michael or a source he confirms.

### 7.4 Launch content list

Pages (all must exist at launch): home, story (chapter one edited; later chapters as written), about, resume, projects index plus project pages for FF Beacon, Gridiron Sites, Dynasty Price Check (already public on gridironsites.com), Hoststing LLC (2015 to 2022, as a retrospective: founded, run for seven years, and sold in a private sale to GlowHost together with its sister company cutalltheshit.com under the same LLC; Michael says nothing about it is private), and mjwalsh.net itself, now, uses, accessibility, contact, colophon, privacy, keyboard.

Posts (target twelve at launch, at least one per category):

- Traversing Darkness: the memoir chapter one as a post; "The day I called my first Uber"; "What I wish the ophthalmologist had said".
- Building Blind: "How I write code I cannot see"; "My screen reader setup in 2026".
- Life: one short post, Michael's choice of subject.
- AI and Automation: "Using Claude as a logged step, not a magic box"; "Twenty-five pipelines, one personal credit card: how FF Beacon runs itself".
- Programming: "Seven years running a hosting company, and what it taught me about uptime" (from the Hoststing years).
- SEO and Marketing: "What 69,885 impressions in 90 days taught me about writing for search" (number re-pulled from Search Console before publishing; it was 73,908 on 2026-10-21).
- Fantasy Football: "Twenty seasons of playing by ear".
- Packers and the NFL: one post timed to the week of launch, whatever the Packers just did.
- Build Log: the first five entries, backdated to real events with Michael's confirmation.

### 7.5 Resume facts, from LinkedIn

Read from linkedin.com/in/michaeljameswalsh while logged in on 2026-10-21 (the experience page lazy-loads; the last three entries only appear after scrolling to the bottom, which the first read missed). Titles, employers and dates are as LinkedIn shows them; the descriptions there are not reused (see 7.1). Before any of these, Michael did freelance professional development work from age 14, which is not on LinkedIn and goes on the resume as its own entry with whatever detail he gives in the interview.

- Full-Stack Developer and Automation / AI Specialist, JWeis Marketing, full-time, remote, October 2024 to present.
- Career break for health and well-being, October 2022 to October 2024. In Michael's own words there: vision problems through 2022, a brain tumor found in October 2022, a craniotomy, vision lost as a complication of the tumor and the surgery, two years spent recovering and relearning how to live blind.
- Support Engineer, BigScoots, full-time, remote, January 2022 to April 2023.
- Chief Executive Officer, Hoststing LLC, self-employed, Houston, February 2015 to April 2022. A Linux-based web hosting company he founded and ran, with a global team of developers and support engineers.
- Director of Technology, JWeis Marketing, full-time, Sugar Land, Texas, August 2020 to January 2022.
- Full Stack Developer, Marie Forleo International, full-time, remote, August 2019 to March 2020. Headless WordPress with Vue and Nuxt, a proprietary learning management system.
- Director of Technology, Supplement Technologies, full-time, Houston, August 2015 to August 2019. SEO across a network of sites, distributed server infrastructure, high-traffic ecommerce platforms, internal IT.
- Systems Engineer and Developer, Kualo, full-time, remote, May 2014 to August 2015.
- Technical Support, A Small Orange, full-time, remote, December 2013 to April 2014.
- Systems Developer, Arvixe.com, full-time, remote, January 2013 to November 2013. Internal billing, HR and server automation systems.
- Lead Developer, OEGLLC, full-time, Houston, October 2012 to February 2013. Primary designer and full-stack developer for client projects.
- Hostgator.com, full-time, Houston, August 2009 to October 2012 (three years, three months), in two roles: Level 3 Technical Support, August 2009 to February 2011; Systems Developer, February 2011 to October 2012 (internal employee management, billing and support platforms).
- Freelance professional development work from age 14 until the Hostgator job (and alongside it). Dates and clients come from Michael in the resume interview.
- Education: Woodstock High School, diploma, 2003 to 2007.
- Location: Fort Wayne, Indiana. Headline on LinkedIn: "Driving innovation through versatility." (Not reused; it is the kind of line the site avoids.)
- Michael is open to work. LinkedIn's setting is phrased "recruiters only", which he did not choose for its wording; the resume page says plainly that he is open to Director of Technology and full-stack roles, without the recruiter qualifier.

Two things that looked like conflicts, resolved by Michael on 2026-10-21:

- Timeline. The symptoms did start while he was Director of Technology at JWeis. He thought his unhappiness was about the job and changed jobs; after moving to BigScoots in January 2022 things kept getting worse, and he realized it was not the job. That is a true beat for chapter one or two, and nothing on LinkedIn needs to change.
- "Twenty years in software" is accurate. He has done freelance professional development work since he was 14, which predates every LinkedIn entry. The resume shows it, and the bio can say "since I was 14".

## 8. Technical architecture

### 8.1 Stack

Versions verified against the npm registry and official docs on 2026-10-20 and 2026-10-21: Astro 7.4.1 (Node 22.22 or newer), @astrojs/vercel 11.0.16, Pagefind 1.5.2, Shiki 4.5.0, astro-expressive-code 0.44.2, axe-core and @axe-core/playwright 4.14.0, pa11y 10.0.0.

Decision: Astro 7, static everywhere it can be, hosted on Vercel (Michael's existing Pro plan), with Supabase for the handful of dynamic reads and writes, Resend for mail, and Google Analytics 4 for traffic.

Why Astro rather than Next.js, which is what every other project of Michael's uses:

- Astro ships zero client JavaScript by default. A blog post page carries no framework runtime at all. That is the single largest lever for Lighthouse 100s and for Core Web Vitals, and less script means fewer ways for accessibility to break.
- Content collections are built in: typed frontmatter validated with Zod, MDX through the glob loader, render() returning the headings for a table of contents, and an image pipeline that emits AVIF and WebP with correct width and height. Next.js 16 has no content collection concept.
- The Astro Fonts API self-hosts the fonts and generates metric-matched fallbacks, which solves the layout-shift problem with one config block.
- Interactive pieces (theme toggle, reading controls, the screen reader view, the command palette, the audio player, the contact form) become islands loaded with client:visible or client:idle, written in plain TypeScript or Preact, so React is never shipped site-wide.
- One caveat: Astro 7 switched its Markdown processor to Sätteri. Blog recipes that assume remark and rehype need the unified() processor set explicitly, and the new Rust compiler rejects unclosed tags. Both are a one-time setup cost.

Why Vercel (decided by Michael on 2026-10-21):

- He already pays for Pro and runs FF Beacon, Gridiron Sites and the client work there. One dashboard, one set of habits, and the Pro plan's terms allow commercial use, so the consulting angle of the site is not a gray area.
- Astro has a first-party adapter (@astrojs/vercel). Prerendered pages and static assets are served from Vercel's filesystem; the two on-demand routes (contact, metrics) become Vercel Functions.
- Vercel Cron Jobs are available on every plan and are configured in vercel.json: Vercel sends a GET to the path on the schedule, with the user agent vercel-cron/1.0, in UTC. The metrics refresh runs this way.
- A deploy hook (a URL that accepts a POST and rebuilds production) lets the metrics function trigger the rebuild after writing fresh numbers.
- Speed Insights on Pro gives field Core Web Vitals without a separate tool.

What Michael sets up on the Vercel side himself (confirmed 2026-10-21): the project, the mjwalsh.net and traversingdarkness.com domains with their redirects, the deploy hook, and the environment variables. What the code needs from that: the deploy hook URL in VERCEL_DEPLOY_HOOK_URL, the CRON_SECRET value, and the rest of the variables in 8.4.

What Cloudflare still does: nothing required. Turnstile (the accessible CAPTCHA alternative) is a widget plus a server-side check and works from any host, so the contact form keeps it. If Michael would rather not keep a Cloudflare account for one widget, the fallback is a honeypot field plus rate limiting, which is weaker but has no third party at all.

Core pieces:

- Astro 7 with TypeScript strict. Every public route is prerendered at build. The site rebuilds on every push to main and once a night through the cron plus deploy hook, so live metrics stay fresh.
- @astrojs/vercel adapter with output: 'static' as the default and export const prerender = false on the API routes only. imageService stays off; Astro's own sharp pipeline handles images at build so the output is plain files.
- @astrojs/mdx for posts, projects and story chapters, with content collections in src/content.config.ts, Zod schemas, and the glob loader.
- astro-expressive-code (Shiki underneath) for code blocks with light and dark themes, copy buttons that announce success, and editor frames.
- Pagefind 1.5 for static full-text search, run as a postbuild step; its Component UI modal is focus-managed.
- Astro's Picture component for AVIF and WebP with explicit dimensions; the one above-the-fold image gets eager loading and high fetch priority.
- Astro Fonts API for Fraunces, Atkinson Hyperlegible Next and JetBrains Mono, self-hosted, subsetted, with generated fallbacks.
- Tailwind CSS with design tokens as CSS custom properties, so both themes and the reading controls work by changing variables only. light-dark() with color-scheme on the root for theme values.
- @astrojs/sitemap, @astrojs/rss with full content and a styled XSL, a hand-written JSON Feed 1.1 endpoint, and satori plus sharp for per-page Open Graph images at build.
- Cross-document view transitions through the CSS @view-transition rule only, no client router, so navigation stays plain HTML with an optional crossfade in browsers that support it.
- Resend for the contact form and the newsletter relay, server-side only. Turnstile on the form.
- Supabase (Postgres) for live metrics, contact submissions (backup to email), optional post view counts, and a newsletter subscriber mirror if needed. Row Level Security on every table, public reads only through a view that exposes exactly the columns the site needs.
- Google Analytics 4 through gtag.js, loaded after the page is interactive (section 10.4 has the loading rules and the IDs). Vercel Speed Insights for field Core Web Vitals.
- Vercel Cron Jobs for the metrics refresh; the deploy hook for the rebuild; IndexNow ping from a post-deploy step.
- Playwright plus @axe-core/playwright for automated accessibility tests on every route, run in CI. pa11y-ci as a second opinion. Lighthouse CI with budgets.
- Vitest for unit tests (content validation, the contrast sampler, the resume renderer, the screen reader view walker).

### 8.2 Repo layout

```
src/
  pages/             routes listed in 4.1, plus rss.xml.ts, feed.json.ts, llms.txt.ts, og/[slug].png.ts, resume.json.ts
  pages/api/         contact.ts, metrics.ts, subscribe.ts (Vercel Functions; prerender = false)
  content.config.ts  collections: posts, projects, story, now
  content/
    posts/           one folder per post: index.mdx plus images
    projects/
    story/           memoir chapters, written by Michael
    now/             one file per month
  data/resume.ts     single source for the HTML, PDF and JSON resume (facts in 7.5)
  layouts/           Base, Post, Project, Chapter
  components/
    ui/              primitives: Button, Link, Disclosure, Dialog, Listbox, Toast
    site/            Header (mark + "Michael Walsh"), Footer, SkipLink, ThemeToggle, ReadingControls, Analytics
    content/         Prose, Figure, Chart, Callout, Audio, Describe
    home/            the four movements
    islands/         ScreenReaderView, Palette, AudioPlayer, ContactForm, SubscribeForm (client-loaded)
  lib/
    metrics/         Supabase reads with paging helper and snapshot fallback
    seo/             metadata and JSON-LD builders
    a11y/            accessible-name computation for the screen reader view
    contrast/        interpolation sampler used in tests
  styles/            tokens.css, global.css, print.css
public/
  img/ audio/ indexnow key file
scripts/
  build-pdf.ts  snapshot-metrics.ts  check-contrast.ts  check-writing.ts
tests/
  a11y/  unit/  e2e/
docs/
  mjwalsh-net-build-plan.md  (this file)  progress.md  handoff.md  content-voice.md  content-topics.md
vercel.json          crons, headers, trailing slash policy
astro.config.mjs     vercel adapter, fonts, integrations, redirects
```

### 8.3 Data

Supabase tables (all with RLS; anon role can read only the public view):

- site_metrics: key (text, unique), value (numeric), label, source, as_of (timestamptz), updated_at. One row per metric. The refresh job upserts.
- contact_messages: id, created_at, name, email, message, ip_hash, user_agent, status. Insert only through the server route after validation and a rate limit. No public read.
- post_views: slug, count, updated_at. Increment through a SQL function called from a server route, debounced per session. Rendered as "viewed N times" only if Michael wants it; off by default.
- subscribers: mirror of newsletter sign-ups if Buttondown's API is used; otherwise unused.

Every read uses one shared helper that pages with range() and orders by a unique column, per the house rule, even where a table cannot exceed 1000 rows today.

### 8.4 Environment and secrets

Variables: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY (new key names only), RESEND_API_KEY, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY, BUTTONDOWN_API_KEY, GSC_SERVICE_ACCOUNT_JSON (metrics job only), CRON_SECRET (checked by the metrics function so only Vercel's cron can call it), VERCEL_DEPLOY_HOOK_URL, INDEXNOW_KEY, PUBLIC_SITE_URL, PUBLIC_TURNSTILE_SITE_KEY, PUBLIC_GA_MEASUREMENT_ID. An .env.example lists names with no values. Production values live in the Vercel project's environment variables, which Michael manages. Nothing with the PUBLIC_ prefix except the site URL, the Turnstile site key and the GA measurement ID, all of which are public by nature.

### 8.5 Redirects and domains

Michael handles the domains in the Vercel dashboard. The code side assumes:

- mjwalsh.net is the canonical host and www.mjwalsh.net redirects to it (a Vercel domain-level redirect).
- traversingdarkness.com is Michael's to redirect, to whichever page he picks once the site is built. It is on his task list in section 14 and is not part of the build.
- Trailing slash policy is set once in the Astro config (trailingSlash: 'never') and matched in vercel.json (trailingSlash: false) so no URL ever has two valid forms.
- Any legacy URLs on mjwalsh.net (if the domain has history in Search Console) get mapped as Astro redirects after checking GSC for indexed paths.

## 9. Accessibility plan

### 9.1 Target

WCAG 2.2 Level AA across the whole site, with AAA met where it is practical: 7:1 contrast for body text in both themes, 1.4.8 visual presentation (line length, spacing, user-adjustable), 2.4.9 link purpose from link text alone, 3.1.5 reading level for the practical pages, 2.3.3 animation from interactions disabled on request. The accessibility statement names the target and the exceptions honestly.

### 9.2 Structural rules

- One h1 per page, no skipped heading levels, headings describe content and are never used for styling.
- Landmarks: header (banner), nav with aria-label, main, aside where used, footer (contentinfo). One main per page. Skip link to main is the first tab stop.
- Every link's purpose is clear from its text. No "read more" without the post title in the accessible name.
- Icon-only controls have an accessible name through aria-label or visually hidden text. Decorative images have empty alt.
- Focus is always visible: a 3 px lamp-colored outline with a 2 px offset, never removed, and checked against both grounds (2.4.7, 2.4.11 focus not obscured, 2.4.13 focus appearance as a target).
- Target size 24 by 24 CSS pixels minimum (2.5.8), 44 by 44 for primary controls.
- No drag-only interactions (2.5.7). Nothing depends on hover, pointer precision or motion.
- Forms: visible labels, error messages tied with aria-describedby, errors announced through a live region, no redundant entry (3.3.7), no timeouts, and the contact form's help is in the same place on every page (3.2.6).
- Custom components (dialog, listbox, disclosure, tabs if any, audio controls) follow the WAI-ARIA Authoring Practices patterns and are tested by keyboard and screen reader before merging. Native elements are preferred wherever one exists.
- Language is declared on html. Abbreviations are expanded on first use.
- Dynamic updates (search results count, form status, copy-to-clipboard) announce through polite live regions. Nothing uses assertive except a submission failure.
- Content reflows at 320 px wide and at 400 percent zoom with no horizontal scrolling and no loss of content (1.4.10). Text resizes to 200 percent without clipping (1.4.4).
- Windows High Contrast (forced-colors) is tested: borders remain, focus remains, the braille mark keeps its outline.
- No content flashes. No autoplay. Audio and video have transcripts.

### 9.3 Beyond the standard

- Body face chosen for low-vision legibility (Atkinson Hyperlegible Next). Minimum 18 px body on desktop, 17 px on phones, measured line length near 65 characters.
- The reading controls in 6.8.
- Long descriptions on informational images and data tables for charts (6.5).
- The screen reader view (6.2) so sighted visitors understand the medium.
- Plain-language summaries at the top of long technical posts.
- A "report an accessibility problem" link in the footer of every page that pre-fills the contact form with the page URL.

### 9.4 Testing matrix

Automated, in CI on every pull request:

- axe-core through Playwright on every route in both themes and at 360 px and 1280 px, failing on any violation.
- pa11y-ci as a second opinion with the WCAG 2.2 AA ruleset.
- Lighthouse CI with budgets: accessibility 100, performance 95 or better on mobile, best practices 100, SEO 100.
- The contrast sampler test for the home scroll arc.
- HTML validation (html-validate) because broken markup produces broken accessibility trees.
- Link checker for internal 404s.
- The writing pattern checker over all content and UI strings (section 7.3), failing the build on em dashes, curly quotes, banned words, and "not just" constructions.

Manual, before each release:

- Full keyboard pass of every page: tab order, visible focus, Escape behavior, no traps.
- NVDA with Firefox and Chrome on Windows (Michael is the tester; this is the site's real advantage).
- VoiceOver on iPhone Safari for the mobile experience.
- 200 percent and 400 percent zoom in Chrome.
- Windows High Contrast mode.
- Reduced motion on.
- Reading with the screen reader view enabled, to confirm it matches what NVDA announced.

Each manual pass is logged with a date in the accessibility fix log.

## 10. SEO plan

### 10.1 Positioning

The site should become the first result for "Michael Walsh blind developer", "Michael Walsh FF Beacon", and "Michael Walsh JWeis", and a page-one result for the practical topics with real search demand and weak competition: blind developer setup, screen reader for coding, blind programmer tools, accessible fantasy football, Claude Code automation examples, and the specific technical posts. Keyword research happens in Phase 0 and produces a topic map in docs/content-topics.md. Done 2026-10-21 with Search Console data and live Google results; Michael chose not to use Semrush, which is a work account.

### 10.2 Entity and author signals

- Person schema on every page through a site-wide @id (https://mjwalsh.net/#person), with name, jobTitle, worksFor (JWeis Marketing), sameAs (LinkedIn, GitHub, ffbeacon.com, gridironsites.com, and any others Michael names), knowsAbout, and image (the portrait in 6.5).
- ProfilePage schema on /about with mainEntity pointing at the Person, plus dateCreated and dateModified. Google names "blog About Me pages" as a valid use and recommends exactly this when an article's author URL is internal.
- Every post carries BlogPosting schema with author linked to the Person @id, datePublished, dateModified, image, wordCount, and articleSection (the category).
- Project pages use CreativeWork or SoftwareApplication schema as fits.
- BreadcrumbList on every nested route.
- WebSite schema with the site search action pointing at /blog?q=.
- An author box on every post links to /about and the social profiles with rel="me". The box is the one place the name appears in the third person ("Michael Walsh"), followed by a first-person line.

### 10.3 On-page

- Unique title (under 60 characters) and description (120 to 160) per page, built by one metadata helper from frontmatter so none are missed.
- Canonical on every page. Category and tag indexes paginate with rel links and only the first page is indexable.
- One h1 per page matching the title's intent.
- Internal linking: every post links to its category, at least two related posts (computed by shared tags at build), and one project or page. Every project links to the posts that mention it.
- Open Graph and Twitter card tags with a generated image per page (title, category, the braille mark, on the page's ground color), rendered at build with satori and sharp from an Astro endpoint.
- Images have descriptive filenames, alt text, explicit width and height, and lazy loading below the fold.
- Reading time and dates are visible and in the schema.
- Draft posts are excluded from the sitemap, feeds and build.

### 10.4 Technical, including analytics

- sitemap.xml generated from the content layer with lastmod from the updated field.
- robots.txt allows everything public, blocks /api, and points to the sitemap.
- RSS and JSON feeds for the whole blog and per category, with full content.
- llms.txt listing the site's main pages and feeds in plain text, since several AI crawlers read it.
- IndexNow ping on deploy for Bing and partners; Search Console sitemap submission at launch and URL inspection for the key pages.
- Core Web Vitals targets, stricter than Google's "good" thresholds of 2.5 s, 200 ms and 0.1: LCP under 2.0 s on mobile, INP under 200 ms, CLS under 0.05. Measured in the field through Vercel Speed Insights and in the lab through Lighthouse CI.
- Google's own guidance (checked 2026-10-20) says there are no extra requirements for AI Overviews or AI Mode beyond being indexed and snippet-eligible, and that llms.txt is not used by Google Search. The llms.txt file stays because Lighthouse's agentic browsing audit checks for it and other AI tools read it, but no SEO effort goes into it beyond five minutes.
- Google's helpful content guidance asks that sites make clear who wrote the content and how. The colophon and every author box do that, and ffbeacon.com already links to the same Person.
- Speculation Rules: a prefetch rule for same-site links with moderate eagerness, ignored by browsers that lack it.
- 301 redirects in 8.5, verified with a crawl after launch.
- Search Console and Bing Webmaster Tools connected at launch, with the gsc MCP already available on this machine for monitoring.

Google Analytics 4, created on 2026-10-21 in the Google Analytics account signed in as mjwalshnet@gmail.com:

- Account ID 408678069 (the account the dashboard labels "FF Beacon"; the new property sits beside the FF Beacon property, not inside it).
- Property "mjwalsh.net", property ID 559880420, reporting time zone New York (Eastern, for Fort Wayne), currency US dollars, industry Computers and Electronics, business size small, objectives "understand web traffic" and "user engagement and retention".
- Web data stream "mjwalsh.net web" for https://mjwalsh.net, stream ID 16171166257, enhanced measurement on (page views, scrolls, outbound clicks, site search, video, file downloads, form interactions).
- Measurement ID: G-1HNN2M5MQ1. This is the one value the site needs; it goes in PUBLIC_GA_MEASUREMENT_ID.

The tag Google provides is the standard gtag.js snippet. The site does not paste it into the head as given, for two reasons: it would be the only render-blocking third-party script on the page, and it would set cookies before the visitor has read a word. Rules for loading it:

- A single Analytics component in the base layout injects the gtag script after the window load event, so it never competes with the page's own assets for LCP. Google Analytics counts the page view the same either way.
- Consent Mode defaults are set before the tag loads: analytics_storage denied by default for visitors in the European Economic Area and the United Kingdom (gtag's region list), granted elsewhere. EEA visitors then send cookieless pings and no banner is needed; everyone else gets the normal measurement. If Michael ever wants a banner, the component already has the hook for it.
- The site enables no advertising features, no Google Signals, and no user ID.
- The screen reader view, reading controls and theme toggle fire custom events (sr_view_on, reading_text_size, theme_dark) so Michael can see which accessibility features people actually use. Nothing about the visitor is recorded beyond what GA collects by default.
- The privacy page names Google Analytics, says what it stores, and links to Google's opt-out.
- Data retention in the property is set to 14 months (the longest GA4 offers) during Phase 1.
- Search Console is linked to the property at launch so queries show up inside GA as well.

### 10.5 Content cadence after launch

- One long post a month, alternating categories.
- Build Log entries whenever something ships, at least weekly.
- /now updated on the first of each month.
- The memoir published chapter by chapter as Michael writes them, each announced to the newsletter.
- A Packers post most weeks of the season if Michael feels like it; none when he does not. The category exists for pleasure, not for a quota.
- Quarterly review of Search Console queries to pick the next topics.

## 11. Performance budget

- HTML per page under 60 KB compressed.
- CSS under 40 KB compressed, one file, no runtime CSS-in-JS.
- First-party JavaScript on a blog post under 40 KB compressed (no React). The home page may add the scroll arc and palette code but stays under 90 KB. Giscus and the audio player load on interaction.
- Google Analytics is the one third-party script and loads after window load, so it is excluded from the first-paint budget but counted in the total: gtag.js is roughly 100 KB compressed, and the budget caps total transferred JavaScript on a post at 150 KB.
- Fonts: three families, subsetted to Latin, variable where it reduces total weight, total under 180 KB, preloaded, font-display: swap with size-adjusted fallbacks.
- Images: AVIF with WebP fallback, largest hero under 120 KB, all with dimensions.
- Lighthouse mobile: performance 95 or better, the other three at 100, on every route, enforced in CI. Lighthouse runs with the analytics tag present, so the score reflects what visitors get.

## 12. Security and privacy

- Contact and subscribe routes validate input with Zod, rate limit by hashed IP, and never echo input back unescaped.
- The metrics function accepts only requests carrying the CRON_SECRET bearer token Vercel sends with cron invocations.
- Supabase: RLS on every table, the public view exposes only what the site reads, the secret key never reaches the client, and migrations ship their policies in the same file.
- Security headers in vercel.json: strict Content Security Policy with nonces for the inline theme and consent scripts and an allowlist for googletagmanager.com and google-analytics.com, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy denying everything the site does not use.
- First-party state (theme and reading preferences) lives in localStorage, not cookies. The only cookies are Google Analytics', governed by the consent defaults in 10.4.
- The privacy page in plain words: what is collected (contact messages, newsletter emails, Google Analytics data, Vercel Speed Insights which stores nothing per visitor), where it is stored, and how to ask for deletion.
- Dependencies pinned and audited in CI.

## 13. Build phases

Each phase ends with a review by Michael with the screen reader, a dated entry in docs/progress.md, and a commit per completed task. Tasks are atomic: one file or one feature per task, no batching, per the house rules.

### Phase 0: Discovery and content (before code)

- No open questions as of 2026-10-21. Michael's own tasks are listed in section 14.
- Record the interviews for the about page, the resume (one pass per job: what he actually did, in his words), and the first twelve posts. The memoir chapters are Michael's to write on his own schedule.
- Gather real assets: the portrait and its confirmed description, project screenshots (re-captured at 2x), the resume facts from 7.5 checked by Michael.
- Keyword and topic research with Search Console and live search results; write docs/content-topics.md. Done 2026-10-21, without Semrush by Michael's choice.
- Write docs/content-voice.md from section 7 with five before-and-after examples, including one LinkedIn sentence rewritten in his voice.
- Pull current metrics (FF Beacon GSC, leagues synced, test counts) and record sources. FF Beacon GSC and the test count were pulled 2026-10-21 into src/data/metrics-snapshot.json; leagues synced has no source yet.
- Michael: Vercel project, domains, deploy hook, and the environment variables from 8.4 as they become available.

### Phase 1: Foundation

- Initialize Astro 7 with TypeScript strict, Tailwind, ESLint, Prettier, Vitest, Playwright, and the Vercel adapter; vercel.json with the cron, headers and trailing slash policy.
- Design tokens in tokens.css, both themes, the inline theme script, the reading controls store.
- Fonts self-hosted through the Astro Fonts API with generated fallbacks.
- Base layout: skip link, header with the mark and "Michael Walsh", nav, footer with the Fort Wayne place line, theme toggle, focus styles, landmark structure.
- The Analytics component with the consent defaults and the deferred gtag load; GA data retention set to 14 months in the property.
- The UI primitives (Button, Link, Disclosure, Dialog, Listbox, LiveRegion) built to the ARIA patterns and tested with NVDA before anything uses them.
- CI: lint, typecheck, unit tests, axe on the layout, Lighthouse CI, the writing checker.
- The braille mark, favicon set, and OG image template.

### Phase 2: Content system

- Content layer with Zod schemas for posts, projects, story chapters, now entries.
- MDX pipeline: Shiki, headings with anchors, table of contents, figure and Describe components, footnotes, callouts.
- Blog index with the three category groups, category indexes, post page, series navigation, related posts, reading time.
- Feeds (RSS, JSON, per category), sitemap, robots, llms.txt.
- Pagefind indexing and the command palette.
- Metadata and JSON-LD builders with tests that snapshot the output for each page type.

### Phase 3: Pages

- About, story (chapter rail, chapter one), resume (HTML from resume.ts, PDF build script, JSON), projects index and the five project pages, now, uses, accessibility, contact (form, Turnstile, Vercel function, Supabase backup, Resend), colophon, privacy, keyboard.
- Home page as four static sections first (no scroll arc yet) so the content and hierarchy are approved before motion.

### Phase 4: Signature features

- The dark-to-light scroll arc with the contrast sampler test and reduced-motion fallback.
- The screen reader view.
- Listen mode: audio component with the voice-source label, transcripts, the first recording (Michael's own or commissioned).
- Long descriptions and chart tables.
- Live metrics: Supabase table, the metrics function, the Vercel cron, the deploy hook call, snapshot fallback, paging helper.
- Reading controls, with their GA events.
- Newsletter (Buttondown through the subscribe function), Giscus, webmentions, all on.

### Phase 5: Launch

- Full manual accessibility pass (9.4) and the first fix log entries.
- Content freeze: twelve posts, all pages, all alt text and long descriptions reviewed.
- The www redirect verified from the outside, Search Console (and the GA link), Bing, IndexNow.
- Lighthouse CI budgets green on every route with the analytics tag present.
- Launch post in Build Log and Traversing Darkness; first newsletter.

### Phase 6: After launch

- Weekly Build Log, monthly post and now update, memoir chapters as written.
- Monthly Search Console and GA review (which categories people read, which accessibility features get used) and a quarterly content plan refresh.
- Quarterly accessibility re-audit, logged.

## 14. Decisions log and Michael's tasks

No open questions as of 2026-10-21. Michael answered the first draft's fourteen questions (summarized at the top of this file) and the five follow-ups that came out of applying them:

1. Hoststing LLC: nothing private. Founded, run for seven years, sold in a private sale to GlowHost along with the sister company cutalltheshit.com under the same LLC. Gets a full project page.
2. Timeline: the symptoms started at JWeis; he blamed the job, moved to BigScoots, and things kept getting worse until it was clear it was not the job. The story and LinkedIn agree once that beat is told.
3. "Twenty years in software": accurate, counting freelance professional work since age 14. The resume lists it.
4. Open to work: yes, and not "recruiters only"; that is LinkedIn's wording. The resume page says it plainly.
5. traversingdarkness.com: Michael redirects it himself to whichever page he picks after the site is built.

Michael's own tasks, outside the build:

- Vercel: the project, the mjwalsh.net domain and www redirect, the deploy hook, and the environment variables from 8.4.
- Redirect traversingdarkness.com once the site is live.
- Write the memoir chapters after chapter one.
- Record the chapters and selected posts, or arrange the voice actor or synthetic voice per piece.
- Confirm the photo's long description with someone who was there.
- Sit for the interviews in Phase 0 (about page, one pass per job for the resume including the freelance years, the first twelve posts).

## 15. Sources

Michael's own material: C:\Users\mjwal\OneDrive\Desktop\my-story.txt, his LinkedIn profile at linkedin.com/in/michaeljameswalsh (experience, education and headline read while logged in on 2026-10-21), ffbeacon.com/about, gridironsites.com/about and its source (src/lib/work.ts, src/app/about), jweis.com and jweis.com/about, the portrait at C:\Users\mjwal\OneDrive\Desktop\ffbeacon\public\img\author\michael-ff-beacon-founder.jpg, the Gridiron Sites design notes from 2026-10-20, and his written answers of 2026-10-21.

Google Analytics: property created at analytics.google.com on 2026-10-21 while signed in as mjwalshnet@gmail.com; IDs in section 10.4.

Writing standard: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

Design references (all opened 2026-10-20):
- https://brittanychiang.com
- https://www.joshwcomeau.com and https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
- https://paco.me and https://paco.me/writing/redesign-2021
- https://leerob.com
- https://blog.maximeheckel.com
- https://antfu.me
- https://hakim.se
- https://www.adhamdannaway.com
- https://robbowen.digital
- https://maggieappleton.com and https://maggieappleton.com/garden-history
- https://bruno-simon.com and https://www.awwwards.com/sites/brunos-portfolio
- https://dennissnellenberg.com
- https://sive.rs/now and https://nownownow.com/about
- https://line25.com/articles/web-design-trends-2026/
- https://www.netguru.com/blog/modern-web-design-trends

Framework, hosting and tooling:
- https://registry.npmjs.org/astro/latest, https://astro.build/blog/astro-7/, https://astro.build/blog/astro-740/
- https://docs.astro.build/en/guides/content-collections/, /guides/images/, /guides/fonts/, /guides/view-transitions/, /guides/integrations-guide/mdx/, /recipes/rss/, /recipes/reading-time/, /guides/integrations-guide/sitemap/
- https://docs.astro.build/en/guides/integrations-guide/vercel/ (read 2026-10-21: @astrojs/vercel 11.0.16, static output, imageService, isr, maxDuration)
- https://vercel.com/docs/cron-jobs (read 2026-10-21: all plans, vercel.json crons, GET with user agent vercel-cron/1.0, UTC)
- https://vercel.com/docs/deploy-hooks (read 2026-10-21: POST URL, 5 per project, 60 triggers an hour)
- https://vercel.com/docs/limits, https://vercel.com/docs/limits/fair-use-guidelines
- https://nextjs.org/blog/next-16-4, https://nextjs.org/docs/app/guides/static-exports, https://nextjs.org/docs/app/guides/mdx
- https://developers.cloudflare.com/turnstile/ (the widget works on any host)
- https://pagefind.app/docs/, https://expressive-code.com/, https://giscus.app/, https://buttondown.com/pricing, https://webmention.io/, https://www.jsonfeed.org/version/1.1/, https://github.com/vercel/satori
- https://supabase.com/docs/guides/database/functions
- https://developers.google.com/tag-platform/security/guides/consent (Consent Mode region defaults)

Accessibility:
- https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- https://www.w3.org/WAI/WCAG22/Understanding/ (target-size-minimum, focus-not-obscured-minimum, focus-appearance, dragging-movements, consistent-help, contrast-minimum, non-text-contrast, resize-text, reflow, text-spacing, pause-stop-hide, animation-from-interactions)
- https://www.w3.org/TR/wcag-3.0/ (Working Draft, 10 September 2026)
- https://www.w3.org/TR/coga-usable/
- https://dyslexiascotland.org.uk/dyslexia-friendly-typed-formats
- https://www.smashingmagazine.com/2021/11/dyslexia-friendly-mode-website/
- https://www.nvaccess.org/about-nvda/
- https://registry.npmjs.org/axe-core/latest, https://registry.npmjs.org/pa11y/latest
- https://developer.chrome.com/docs/lighthouse/agentic-browsing/

SEO and performance:
- https://developers.google.com/search/docs/appearance/structured-data/profile-page, /article, /breadcrumb
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://www.indexnow.org/documentation, https://blogs.bing.com/webmaster/
- https://web.dev/articles/vitals, https://web.dev/articles/font-best-practices
- https://developer.chrome.com/docs/web-platform/prerender-pages
- https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition
- https://webstatus.dev (feature status for container queries, :has, light-dark, text-wrap, view transitions, scroll-driven animations, anchor positioning, AVIF, speculation rules)
