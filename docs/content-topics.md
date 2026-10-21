# Content topics for mjwalsh.net

Written 2026-10-21 for Phase 0 (section 10.1 of the build plan). Sources: Google Search Console for ffbeacon.com, dynastypricecheck.com and gridironsites.com, 90 days to 2026-10-21, and live Google results (US, English) read in Chrome the same day.

No keyword tool was used, by Michael's choice, so there are no monthly search volumes or difficulty scores here. The only demand numbers are Search Console impressions for his own sites. For everything else this map judges the opportunity by what ranks today: how old it is, whether it answers the question, and whether someone with Michael's experience could answer it better. Treat those as judgments, not measurements, and check them against mjwalsh.net's own Search Console data once it has a few months of it.

## What Search Console says

### ffbeacon.com, 2026-07-23 to 2026-10-21

| Figure | Value |
| --- | --- |
| Clicks | 2,025 |
| Impressions | 73,908 |
| Average position | 11.6 |
| Clicks to the FAAB tools (the calculator and its guillotine version) | 1,374, about 68 percent |

Findings worth writing about:

- The FAAB calculator is the site. "guillotine faab calculator" alone brought 220 clicks at position 4.2, and "faab calculator" 200 clicks from 3,180 impressions at position 7.4. Guillotine and chopped league queries click through at 25 to 48 percent, far above the generic ones at 6 to 11 percent: people looking for the niche tool find exactly what they want.
- The guides draw impressions but almost no clicks. The fantasy football terms guide had 9,215 impressions and 7 clicks. The playoffs guide had 6,231 impressions and 17 clicks. The FAAB settings guide had 3,933 and 10. All sit around position 7 to 13, which shows on page one and still gets passed over.
- Clicks spike on Tuesdays, waiver day: 362 on 2026-09-29, 177 on 2026-10-06, 179 on 2026-10-13 and 257 on 2026-10-20, against a typical 15 to 50.
- Brand searches work: "ffbeacon" and "ff beacon" click through at 84 and 91 percent.
- Impressions grew from single digits a day in late July to 2,000 to 4,700 a day in October.

### dynastypricecheck.com and gridironsites.com

- Dynasty Price Check started showing on 2026-10-19: 19 clicks from 30 impressions, ranking first for its own name.
- Gridiron Sites has 2 impressions. It has no search presence yet.

### The number in the planned SEO post

The plan's post is titled "What 69,885 impressions in 90 days taught me about writing for search", with the number to be re-pulled before publishing. Today's 90-day figure is 73,908. The site's metrics job will keep it current; the title should use whatever the job reports on the day the post goes up. The findings above are the material for that post: the calculator that earns two thirds of the clicks, the guides that show and get skipped, and the Tuesday pattern.

## The name searches the site should own

| Search | What ranks today | What to do |
| --- | --- | --- |
| "Michael Walsh" blind developer | Nothing about Michael. Other Michael Walshes on LinkedIn, a Celtic linguistics paper, a counselling professor. | The about page, the Person schema and the author box are written for this. Nobody competes for it, so it should follow once the site is indexed and linked. |
| Michael Walsh FF Beacon | FF Beacon's Instagram and its terms page (which names him), then the Boston firefighters Edward Walsh and Michael Kennedy, killed at the 298 Beacon Street fire in 2014. | Link mjwalsh.net from FF Beacon's about page and footer with his name, and from the Instagram bio. The firefighter results are a memorial and will stay; the goal is to sit above them, not to displace them. |
| Michael Walsh JWeis | Not checked. | Check in Search Console after launch. The resume and about page carry the employer. |

The name is crowded. Every profile Michael controls (LinkedIn, GitHub, FF Beacon, Gridiron Sites, Instagram) should link to mjwalsh.net, and the site links back with rel="me", which it already does.

## The practical topics

Ranked by how good the opening looks.

### 1. Accessible fantasy football. Strong opening.

What ranks: an r/Blind thread from a month ago asking which fantasy platform works with VoiceOver on an iPhone, with two replies; a Yahoo piece and an Athletic profile from 2021; then ordinary fantasy content that ignores accessibility.

The question is being asked right now and nobody has answered it well. Michael plays in leagues by ear and built a fantasy site whose tagline is "by eye or ear". Related phrasings Google suggests: "accessible fantasy football reddit", "best accessible fantasy football".

Use for: "Twenty seasons of playing by ear", reworked to answer the question directly (which platforms work with VoiceOver and NVDA, which do not, and how he follows a draft and a game), with FF Beacon as one answer among the honest others. A short Building Blind companion post comparing Sleeper, ESPN, Yahoo and NFL Fantasy with a screen reader would be the most useful thing on the subject anywhere.

### 2. Blind developer setup. Strong opening.

What ranks: freeCodeCamp from 2019, Reddit threads from four to six years ago, a Stack Overflow question locked 18 years ago, a dev.to post from 2019 about testing, not working, and a 2016 blog post titled "The Tools of a Blind Programmer". Google marks several results "Missing: setup": it has nothing that matches the whole query.

The results are old and none is a current, complete setup from someone working full time. Related phrasings: "blind developer setup reddit", "blind developer setup software".

Use for: the /uses page, which should be titled and opened plainly around "my setup as a blind developer in 2026", and "How I write code I cannot see".

### 3. Blind programmer tools, and coding with AI when blind. Good opening, and the AI angle is current.

What ranks: Code Jumper (a children's product), a university research tool, the same 2016 blog post, Reddit and Quora threads, and three 2026 videos about blind people building tools with AI ("Vibe Coding with AI: How Blind Users Can Build Their Own Tools", "How a visually impaired engineer builds personal software with AI").

The interest in AI as a way in is new and served mostly by video. A written account from a working developer who builds production systems with Claude Code is missing.

Use for: "How I write code I cannot see" and "Using Claude as a logged step, not a magic box", each with a section that answers "which tools" directly.

### 4. Screen reader for coding, and NVDA versus JAWS. Moderate opening.

What ranks for "screen reader for coding": mostly guides for sighted developers testing their sites (Codecademy, W3Schools, the A11Y Collective), plus Reddit. For "nvda vs jaws for programming": CSS-Tricks and UXPin comparisons written for testers, and an r/Blind thread whose top answer is "Hands down, NVDA".

The results answer a different question (how to test with a screen reader) from the one a blind coder asks (how to work with one). Related phrasings: "best screen reader for coding", "screen reader for coding nvda", "nvda vs jaws for programming python", and the question "Is NVDA better than JAWS?".

Use for: "My screen reader setup in 2026". Say in the first paragraph which screen reader and why, compare NVDA and JAWS for coding from experience, and cover the editor and terminal settings that matter.

### 5. Claude Code automation examples. Crowded.

What ranks: Anthropic's own documentation, an AI overview, agency blogs, an awesome-list on GitHub, Medium and Substack posts, and many videos, mostly from 2026.

The head term is taken by the documentation and by people publishing about it full time. Do not chase it. The narrow angles nobody covers are Michael's: Claude as one logged step in a pipeline, a set of scheduled pipelines that run a fantasy site on a personal card, and hooks used for accessibility (his Stop hook that strips markdown so a screen reader does not read punctuation aloud). Google suggests "claude code hooks examples", which that last one fits.

Use for: "Using Claude as a logged step, not a magic box" and "Twenty-five pipelines, one personal credit card". Write them for developers who already use Claude Code, with real code and real numbers, and expect them to earn links and shares more than search traffic.

### 6. Chopped and guillotine league FAAB strategy. Competitive, and it belongs to FF Beacon.

What ranks: a dedicated chopped-league site, the Fantasy Footballers, RotoWire, FTN, FantasyLife, Fantasy Points and active subreddits, all updated weekly.

This is FF Beacon's market and its guide already ranks around position 7.7. Do not compete with it from mjwalsh.net. A Build Log entry or the impressions post can link to the FF Beacon guide instead.

## The story posts

Searches for the medical side ("lost vision brain tumor misdiagnosed ophthalmologist", "can an ophthalmologist tell if you have a brain tumor") are answered by hospitals, journals and charities, which is right for health questions. The memoir chapters and "What I wish the ophthalmologist had said" should not be written to rank for them. They will be found through the name, through links, through the newsletter and through people who share them. "The day I called my first Uber" is the same.

If Michael wants one story post to be findable, the honest fit is a reader's question rather than a medical one: the Reddit threads in r/braintumor and r/Blind where people ask what losing sight to a tumor is like and how they kept working. A post that answers "How I kept working after losing my sight" in plain terms would meet them.

## Map of the launch posts

| Post | Primary search | Other phrasings | Search case |
| --- | --- | --- | --- |
| Memoir chapter one | Michael Walsh (name) | None | Readers and links, not search |
| The day I called my first Uber | None | None | Story, not search |
| What I wish the ophthalmologist had said | None | None | Story; health searches belong to medical sites |
| How I write code I cannot see | blind programmer | blind developer, coding when blind, blind programmer tools | Strong |
| My screen reader setup in 2026 | screen reader for coding | nvda vs jaws for programming, best screen reader for coding | Moderate |
| /uses (page) | blind developer setup | blind developer setup software, tools of a blind programmer | Strong |
| Life post | None | None | Personal |
| Using Claude as a logged step, not a magic box | claude code hooks examples | claude code automation examples | Narrow; links more than search |
| Twenty-five pipelines, one personal credit card | None directly | claude code automation examples | Links and shares |
| Seven years running a hosting company | running a web hosting company | selling a hosting company | Not checked; small |
| What 73,908 impressions taught me (title follows the live number) | None directly | search console lessons | Story built on real data |
| Twenty seasons of playing by ear | accessible fantasy football | blind fantasy football, best accessible fantasy football | Strong |
| Packers launch-week post | None | None | Timely, not search |
| Build Log entries | None | None | Freshness and return visits |

## Next steps

- Add a Building Blind post comparing the fantasy platforms with a screen reader. It is the clearest unanswered question found.
- Link mjwalsh.net from FF Beacon (about page and footer), Gridiron Sites, Dynasty Price Check and the Instagram bio, using the name Michael Walsh.
- Once mjwalsh.net has three months of Search Console data, replace the judgments here with its own queries, and revisit this file quarterly as the plan says.
- Two topics were not checked and should be before those posts are written: "Michael Walsh JWeis" and the hosting-company post.
