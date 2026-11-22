# Changelog

Named releases are saved at [GitHub Releases](https://github.com/tyleroars/personal-website/releases). A release groups visitor-facing changes; small editing sessions do not each need a release.

## Unreleased

- Added BVRobin to Projects with screenshots from its guided demo, photos from the Vancouver DevDay Exchange Community Hackathon, and links to the desktop preview and source code.

## v1.3.0 · 2026-11-15

- Added Token Usage with a daily calendar, monthly and weekday charts, and a running total. Every chart reconciles exactly with the Codex Tokens headline. The page supports pointer, touch and keyboard inspection, and includes its figures before JavaScript runs.
- Connected the page to a public aggregate from the documented account-usage endpoint. Work activity is excluded. A local daily refresh validates data before preparing checked data-only pull requests; unavailable or inconsistent data preserves the previous snapshot. The Mac, desktop app and existing login must be available for refreshes.
- Kept project titles first and grouped descriptions, outcomes and previews consistently. Values use the Work page's sage highlight, with labels beneath and separators between multiple figures. Web projects show one preview; HuddleDex's three phone screens share the same overall width. Full galleries remain in the readers.
- Improved all 51 gallery images with responsive display files, lightweight placeholders, reserved layout space and adjacent-image preloading. Retained gallery endpoints, captions, keyboard navigation and touch gestures.
- Refined About's arch with denser staggered tiles, a left-to-right gradient and independent cursor-responsive movement. The mascot stays fixed, the arch returns to rest when the cursor moves away, and animation respects reduced motion and pauses offscreen.
- Added Token Usage to About and navigation, with a dedicated sharing card, search metadata, text summary and synchronized LLM documents.
- Completed desktop, narrow-mobile and both-theme review. All 31 automated checks pass, including token reconciliation, gallery loading and arch clearance/reset behavior.

## v1.2.0 · 2026-11-11

- Replaced the initials favicon with Tyler’s selected Solid join mark across browser icons and touch icons.
- Reworked all 15 project stories around the original problem, how the tool works, practical use and supported outcomes. Clarified data integrations, prototype limitations and the assumptions behind workflow-savings comparisons.
- Made project titles the clear entry point to onsite readers. Fixed shared project URLs, browser history, close behaviour and keyboard focus.
- Put concise project context and outcomes before the story. Refined the neutral reader surface, typography, spacing and mobile layout, with earlier visual evidence and collapsible supporting details.
- Removed white letterboxing from project previews and added a distinct Slides → Video export view. Updated galleries with thumbnails, stable circular controls, unavailable-direction hiding and horizontal touch gestures.
- Unified link feedback, article heading colours and section spacing. Removed repetitive dividers and the unused site-wide cursor follower while preserving About’s rainbow interaction. Improved mobile Writing entries and article footers.
- Improved loading with build-time page rendering, responsive media, combined CSS, minified scripts and fingerprinted caching. Added no-script project stories and kept preview hosts out of search results.
- Synchronized project descriptions, outcomes and public agent documents. Refreshed llms.txt and llms-full.txt, and added biography/CV drift checks.
- Completed desktop, mobile and both-theme QA. All 20 automated checks pass; local mobile audits scored 98–100 for performance and 100 for automated accessibility. These are lab results, not production field measurements.

## v1.1.0 · 2026-11-10

- Refreshed the About copy and added an original, cursor-responsive rainbow with Tyler's mascot. Respects reduced motion and sleeps when idle.
- Made dark mode the default, refined both palettes, added the mobile dropdown, and aligned navigation, highlights and link feedback across sections.
- Expanded project stories around the original problem, what was built, actual use and supported outcomes. Added the Career Intelligence Report and historical Career Coach GPT context under GradSimple.
- Added more app screenshots and real report output, with clearer inline galleries and project readers.
- Created individual HD sharing cards and clear metadata for every section and article. Added structured data and kept search routes, redirects and Markdown alternatives consistent.
- Synchronized project narratives and public proof with the agent-readable documents.
- Added release version reporting, verified backup archives, change notes, deployment checks and documented rollback procedures.

## v1.0.0 · 2026-11-09

Initial live site on itstyleryip.com with GitHub source and automatic Cloudflare Builds. Baseline commit: `31e0d468eec19b34f6a15c0b448d6784e1944910`.

Before v1.1.0, the live homepage, Projects, Writing, CSS, site/project scripts and llms.txt were compared with a fresh build of this commit and matched exactly.

Cloudflare baseline Worker version: `c79aa8a8-1f7f-45a5-8147-40c81c5ca719`. Cloudflare retention is finite; the Git tag and source archive are the durable fallback.
