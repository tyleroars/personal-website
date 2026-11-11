# Site-wide QA

Reviewed November 11, 2026, on the local production preview. The current feature branch is ready for design review; no push or deployment was performed.

## Assessment

The portfolio is cohesive and content-led. Dark navy surfaces, the same system font, sage accents, shared navigation alignment and a consistent heading hierarchy carry across the five main sections and article template. Active navigation uses a filled state; content links use underlines; outcomes use restrained emphasis. These differences communicate different roles rather than arbitrary styling. The rainbow remains the one expressive decorative element on About. Project screenshots naturally retain their own apps’ colours.

Project readers share one neutral sheet and the same gallery controls. The glass-inspired treatment is local to the reader’s depth and small controls; it is not applied as an extra box behind every content block. Repeated list rules have already been replaced by spacing, while genuine section boundaries remain.

## Issues fixed

- Writing metadata squeezed headlines and excerpts at narrow widths. Below 480px, text now gets the full column, with date/read time right-aligned in a row beneath it. At 319px, the text and entry widths both measure 271.5px.
- Article credits inherited the general footer’s flex layout, spreading the credit across the row. Credits are now normal inline prose. Removed redundant rules around adjacent article navigation and the site footer.
- Light-theme article headings and emphasis retained older green-grey colours. They now use the shared text token, matching the rest of the site.
- A legacy cursor follower was still loaded on all pages. Removed its references from all 27 source HTML files and its dedicated styles. About’s contained rainbow interaction remains. An automated check prevents the follower script from being reintroduced into personal-page HTML.
- Both agent profiles now carry a November 11 review date. Current public text already matched, so project stories and article metadata were not rewritten.

## Visual and interaction checks

- Reviewed About, Projects, Writing, Work, Interviews and a long article in dark desktop, 319px dark and 390px light layouts. Checked the five main pages at the 642px desktop/sidebar breakpoint. No horizontal page overflow, missing alt attributes or broken loaded images were found.
- Rechecked all six page types at 390px dark after fixes. Verified the Writing fix at 319px, article-footer layout and colours on desktop, and absence of the cursor follower.
- Mobile menu: shared row padding, 44px toggle, open/close, Escape focus return, navigation to Projects and persisted theme choice.
- Project reader: expanded GradSimple’s related tools at 390px without overflow; Escape returns focus to the opening title. Existing gallery boundary/focus/thumbnail/touch-intent checks pass. All 15 reader layouts were also checked in the preceding unchanged reader review.
- Gmail links use mailto:tyleryip.sg@gmail.com. No email was sent. Normal desktop viewport and dark mode were restored. Browser console had no warnings or errors.
- Build checks validate metadata and distinct sharing images for all routes, local resource paths, every gallery asset, every interview portrait, navigation history, real 404s and agent links. All 20 checks pass.

## Local Lighthouse results

Latest measured mobile simulation for each page type:

| Page | Performance | Automated accessibility | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| About | 99 | 100 | 2.0s | 0 |
| Projects | 100 | 100 | 1.5s | 0 |
| Writing | 100 | 100 | 1.4s | 0 |
| Work | 98 | 100 | 1.8s | 0 |
| Interviews | 99 | 100 | 1.7s | 0 |
| Long article | 100 | 100 | 1.4s | 0 |

The first pass ranged from 96 to 100 for performance. Writing and the article were rechecked after their layout changes. Scores vary between local runs; this does not attribute the score difference to CSS alone. These are local simulated results, not production field metrics, native iPhone/Safari testing or full manual accessibility certification.

## Agent and link checks

- Ran project-text and metadata synchronization. They produced no content drift: 15 projects, 21 articles and the 85-interview directory remain consistent.
- Extended agent checks to compare the visible About paragraphs and Work achievements, skills, headings and role/date lines with their Markdown and both agent profiles. These complement the existing project/story/outcome/workflow checks.
- llms.txt and llms-full.txt return HTTP 200 as UTF-8 plain text. Their published Markdown links are absolute and resolve. Markdown equivalents, robots.txt and sitemap.xml also return 200. Linked text needs no JavaScript or account.
- Checked all 13 project destinations that have a public URL: all returned HTTP 200, including the archived Kawaii Peach storefront. This establishes reachability, not the functionality of every original app or historical API integration. The Career Intelligence Report remains a historical prototype, as requested.
- At the time of this audit, the live domain served v1.1.0 at commit 5954903 with a November 10 agent-profile date. The reviewed changes and November 11 profiles are grouped in v1.2.0. Publishing and live verification follow the release guide; this audit records the pre-release review.

Inspect the ignored outputs/site-qa-20261111 directory for screenshot comparisons, project-destination status checks and the local audit summary. No private customer data was added to public source.
