# Verification map

## Existing coverage

`scripts/launch.test.mjs` runs on PRs and main in **Check website / build-and-test**, in Cloudflare's build command, and in the release archive job. Passing CI is a maintainer merge requirement; branch protection is not configured or guaranteed by these files.

| Use case → rule | Expected behavior, including negative case | Evidence | Status |
| --- | --- | --- | --- |
| Release identity | Correct version, full commit, boolean dirty flag; JSON revalidates and is noindex | build.mjs, launch.test.mjs; releases.md | Existing automated |
| Theme | Default dark; saved light/dark wins; blocked storage does not crash | theme-init.js, launch.test.mjs | Existing automated |
| Search/share | Each page has unique metadata, canonical, structured data and valid HD PNG; missing metadata/image fails build | page-metadata.mjs, structured-data.mjs, build.mjs, launch.test.mjs; seo.md | Existing automated |
| Public package | HTML/CSS local links and gallery portraits exist; hidden/private filenames absent | launch.test.mjs; architecture.md | Existing automated |
| Agent text | Current project narrative/outcomes/workflows are present in all public project documents; local links resolve as absolute URLs | sync-project-text.mjs, launch.test.mjs; seo.md | Existing automated |
| Favicon | Every compiled page uses the current TY artwork; PNG sizes and ICO frames are valid | launch.test.mjs; page-metadata.mjs | Automated |
| Story history | Correct URL, direct arrival, close/Back/Forward, reload, category hash and legacy aliases | project-navigation.test.mjs | Automated with simulated browser history; real browser journey also checked |
| Initial content | Page copy, 85 interview rows, 21 writing entries and all no-script project stories are present; unused collection datasets are not loaded | production-pages.mjs, launch.test.mjs | Automated |
| Responsive images | Variants exist at declared widths; previews stay separate from gallery originals | production-pages.mjs, launch.test.mjs | Automated |
| Browser cache | Matching fingerprints cache immutably; stale assets and HTML revalidate; ETag matches return empty 304 responses | build.mjs, launch.test.mjs | Automated |
| Preview indexing | Public noncanonical hosts are noindex; canonical production pages remain indexable | build.mjs, launch.test.mjs | Automated |
| Tool value estimates | Published percentages reconcile with stored before/after assumptions; Lightroom comparison includes CAD pricing, billing scope, source and avoided-cost wording; reader and agent documents contain the same methods | launch.test.mjs; projects.js; sync-project-text.mjs | Automated arithmetic and content synchronization; estimates are not measured user averages |
| Routes | Canonical redirects, UTF-8, HEAD, 405 for document POST, noindex text and real 404 | generated Worker, launch.test.mjs; flows.md | Existing automated |
| Archive | Clean tagged checkout, matching tag/version/commit, file checksums; refuses mismatch/dirty source | package-release.mjs, release.yml; releases.md | Existing release-job checks |
| Deployment | Expected live version/commit; all 27 HTML routes, 27 PNG cards, current scripts/agent documents, redirect and 404 | verify-live.mjs; releases.md | Existing operator-run live check, not a PR gate |

## Proposed tests

| Use case → rule | Expected behavior | Evidence | Type / status |
| --- | --- | --- | --- |
| HuddleDex import/storage | Bad JSON rejected, browser storage denial visible, existing local records preserved on import failure | huddledex-browser/index.html; flows.md | Automated integration, proposed |
| Release download restore | Extracted archive hashes match manifest; isolated local preview matches saved tag | package-release.mjs; releases.md | Manual review, proposed recurring drill |
| External services | Historical project and interview targets still resolve; failures get appropriate captions | projects.js, interviews.js | Guarded live, proposed |

## Gaps

| Priority | Rule / exposure | Current gap |
| --- | --- | --- |
| 1 | Published source contains only intended public material | No automated tool can prove permission/context for every screenshot. Staged files and new imagery need human/agent review. |
| 2 | HuddleDex local import/export data integrity | No automated browser integration coverage yet; manual testing is needed before changing this demo. |
| 2 | Mobile layout, contrast and reduced motion remain usable | Visual checks are manual; no pixel or interaction regression suite. |
| 3 | Cloudflare/GitHub outage recovery | No destructive production rollback drill. Retained deployment history is finite; Git tags and archives are the durable backup. |

The suite proves code and packaged resources, not search ranking, audience claims or availability of third-party services.

## Preview verification, 2026-11-10

- Real browser journey: About → GradSimple → close → Newsletter Converter → reload → Back → Forward → Escape. Correct story/hash and focus restoration verified.
- Direct HuddleDex link opened its story. Legacy category hashes remain supported, although category navigation and status labels have been removed. GradSimple’s five related tools started collapsed and expanded on request.
- Tab and Shift+Tab wrapped within the reader, and Escape closed it. Mobile menu expanded and closed with Escape.
- Actual CSS viewport widths of 390px and 319px had no horizontal overflow; the reader stayed within the viewport, long titles wrapped, story text was 16px and gallery arrows were 44px (43.992px measured after zoom rounding). Temporary viewport overrides were reset.
- Desktop light/dark layouts, mobile dark/light layouts and 16/32/48px favicon samples inspected. Valid 390px mobile screenshots were captured after resolving a browser capture scaling artifact; no site content was missing. The final screenshots show the simplified title-and-arrow controls, spacing and passive image previews.
- After optimization, actual browser checks reconfirmed direct About links, reader focus, Escape, gallery loading, mobile menu controls and no horizontal overflow at 390px and 319px. Menu links measure 64px tall; menu/theme controls and reader close are at least 44px subject to zoom rounding. No console warnings or errors were recorded on the final preview journey.
- Lighthouse mobile checks cover all five sections and a representative article; desktop checks cover Home, Projects and Interviews. Conditions, measurements and production-only limits are recorded in [performance.md](performance.md).
- Public build and tests cover packaged local assets and text. They do not verify the uptime of external apps or establish project audience metrics. No production deployment performed.

## Project results refinement, 2026-11-10

- All result captions use the same 12px regular-weight type after the previews; numbers and recognition no longer use large display blocks.
- Modelled workflow comparisons are 5 → 2 minutes for image preparation, 15 → 5 minutes for newsletter formatting, and 10 → 2 minutes for a ten-slide video. The resulting rounded reductions are 60%, 67%, and 80%.
- The video export test supports the export step only. Manual baselines and overall workflow durations are estimates, with scope and exclusions in the reader and public project documents. No recurring frequency or annual hours are assumed.
- Tone Lab compares against the C$15.99/month Canadian Adobe Lightroom annual plan billed monthly, annualized to C$191.88 before tax. It is an avoided-subscription comparison, not a previously paid bill.
- Real browser checks cover 390px dark and 319px light layouts without horizontal overflow, uniform result sizing, an expanded cost comparison, an expanded time-saving estimate, and reader Escape. Supporting text inherits the correct theme body colour.
- Build and all 17 checks passed. Local preview only; no production deployment.

## Grouped outcomes, 2026-11-10

- Outcomes now precede the screenshots and sit directly beneath each project description in a raised-surface strip. Values use 13px, 550-weight type; labels use the same size at regular weight. Recognition follows the same treatment.
- Verified the new order for every outcome strip in the real browser. Clicking a figure leaves the page unchanged and opens no dialog. Dataset coverage for Starting Pay Checker and Job Market Radar is in the descriptions rather than an outcome strip.
- Desktop dark and mobile dark/light were visually checked. At actual viewport widths of 390px and 319px, every strip wraps within its available width with no horizontal overflow. No console warnings or errors were recorded. Temporary viewport settings were reset and the preview restored to dark mode.
- Public project text is synchronized. Build and all 17 existing checks pass. Preview only; no push or deployment.

## Project copy and integrations, 2026-11-10

- Removed Est. prefixes from visible figures while retaining modelled baselines and estimate scope in expandable reader notes and agent documents. Existing calculation checks still reconcile percentages with the assumptions.
- Replaced video-prep jargon with time turning slides into videos. The three time-saving strips stay on one line at a 319px viewport, with values and labels aligned and no overflow.
- AI Worth Trying now explains its published library in the description and story rather than repeating counts in an outcome strip and block. Mobile reader opened, contained its catalog explanation and closed with Escape.
- Career Intelligence Report describes a general Claude API report. Quiz traction and the unlaunched Frenz collection are retained in their detailed stories rather than short descriptions/outcome blocks.
- Read-only technical inspection confirms the Radar JOLTS API/cache implementation, Starting Pay OEWS import and internal API, and the report’s direct Claude Messages API request. Career Explorer serves a saved occupation dataset; its O*NET Web Services source is user-confirmed, with official service capabilities checked. No original apps, API credentials, cron executions or model requests changed. Private evidence stays outside the public source.
- All public project documents synchronized; build and 17 existing checks pass. Browser checked dark desktop, mobile widths 390px/319px, light mode and reader Escape. Official data documentation was checked separately. Temporary viewport overrides reset, dark mode restored, and no console warnings/errors recorded. Preview only.

## Standalone outcome statements, 2026-11-10

- Result copy now names the task, input/output and publishing destination, including email newsletters becoming WordPress articles and TikTok photo slides becoming YouTube videos. Other outcomes identify the software comparison, community, award focus or social platforms/timeframe.
- Replaced split definition-list fragments with native list items containing an inline emphasized value and full result text. This preserves value-first reading order for assistive technology and lets longer statements wrap normally.
- Real-browser checks at 319px confirm no horizontal overflow and no isolated percentage above its statement. Full statements span two or three lines where needed. Dark desktop and narrow light mode inspected; existing 13px type and raised-surface styling remain consistent. Viewport override reset and dark mode restored. No console warnings/errors recorded.
- Expanded unexplained abbreviations and made the tool summaries lead with their function. Exact API/data details remain in the stories. Project documents and agent profiles synchronized; build and all 17 existing checks passed. Preview only.

## Distinct Slides → Video screenshots, 2026-11-10

- Captured a fresh successful MP4 export in the original converter using two public event photos as demo inputs: two slides, four seconds, 1.8 MB.
- Kept the slide-arrangement screenshot and replaced the repetitive export/editor screenshot with a close view of the completed result and download panel. Captions distinguish the steps and identify the demo.
- Real-browser checks confirm both previews load, the reader advances to image 2 / 2 with the matching caption, and the page has no horizontal overflow. Build and all 17 existing checks pass. Local preview only; no push or deployment.

## Project reader stress test, 2026-11-11

- Reviewed all 15 public readers on desktop, at 319px in light mode, and at 390px in dark mode. No horizontal reader overflow after the HuddleDex control fix; 16px story/outcome type and title focus verified.
- Expanded related tools and the full build prompt; verified both Tab wrap directions, Escape and focus return. Checked gallery navigation and natural image sizing.
- Measured reading width and contrast, and ran a focused local Lighthouse check: performance 98, automated accessibility 100, CLS 0. Full observations, limitations and primary references are in [project-reader-review.md](project-reader-review.md).
- Build and all 17 existing checks pass. Project wording, figures, URLs and prompts are preserved. Local preview only.

## Outcomes-first reader order, 2026-11-11

- Checked all 15 readers on desktop and at a 319px × 844px phone viewport. Each has exactly one summary directly below the title; supported outcomes precede the narrative, with no empty outcome block for projects without results.
- No horizontal overflow. Summary text is 16px, and outcome lists, where present, are visible in the initial phone viewport. Focus still starts on the title; the preview was restored to normal desktop size and dark mode. No console warnings or errors.
- Build and all 17 existing checks pass. Project copy, evidence and agent documents are unchanged. Local preview only; no push or deployment.


## Project panel surfaces and gallery boundaries, 2026-11-11

- Opened all 15 project readers at 319px × 844px: no horizontal overflow, 16px summaries, title focus, and matching Outcomes/gallery heading alignment where present. Reviewed 390px dark and light layouts, including expanded cost notes.
- Navigated HuddleDex from first to last and back. Unavailable arrows are hidden, keyboard navigation cannot wrap, and focus transfers to the available arrow at endpoints. Both HuddleDex galleries start with only Next.
- Reviewed the frosted overview finish and spacing-based grouping on Projects, Writing, Work and Interviews. Main section boundaries remain. Browser console reports no warnings/errors.
- Local mobile Lighthouse: performance 98, automated accessibility 100, CLS 0, total blocking time 0ms. Build and all 17 existing checks pass. Full observations and scope are in [project-reader-review.md](project-reader-review.md). No deployment.


## Reader material and gallery revision, 2026-11-11

- Removed the inset overview box; retained the outcomes-first order and common text column. Reviewed neutral reading surfaces, rounded desktop sheet and background blur. Small controls have solid reduced-transparency/forced-colour fallbacks.
- Checked all 15 readers at 319px dark: no reader/footer overflow and exact Outcomes/gallery heading alignment. Reviewed 390px light Tone Lab with expanded cost notes, and normal desktop dark HuddleDex.
- Verified fixed button positions, first/last hidden directions, focus at endpoints, selected-thumbnail scrolling and Escape focus return. Added three gallery-controller tests for boundaries/focus, synchronized media/thumbnail state and horizontal gesture intent. Native device touch behaviour remains a manual-test limitation.
- Build and all 20 checks pass. Local mobile Lighthouse: performance 98, automated accessibility 100, LCP 1.8s, CLS 0, total blocking time 10ms. No console warnings/errors. Normal viewport and dark mode restored. Preview only.


## Site-wide QA, 2026-11-11

- Reviewed all five main sections and the long article template across desktop, 319px/390px phone widths, both themes and the 642px sidebar breakpoint. Fixed narrow Writing text, article credits/footer rules, article heading tokens and the legacy global cursor follower.
- Navigation, theme persistence, reader disclosure/Escape focus and mailto target checked. No horizontal overflow, missing alt attributes, broken loaded images or browser console issues found in the review.
- Agent-content checks now include About paragraphs and Work bullets, skills, headings and role/date lines. Existing project synchronization passes; both profiles’ review dates are November 11. All 20 checks pass.
- Latest local page-type Lighthouse measurements: performance 98–100, automated accessibility 100, CLS 0. Earlier baseline performance ranged 96–100. Full scope, findings, per-page figures and limitations: [site-wide-qa.md](site-wide-qa.md). Preview only; no deployment.
