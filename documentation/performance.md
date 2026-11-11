# Local performance and access audit

Audited November 10, 2026, for the next preview update. No deployment was performed.

## Conditions and limits

- Lighthouse 13.6.0, Chrome 157.0.8103.40, Node 22.22.3, on the same computer.
- Compiled production Worker and static assets served through a loopback Node wrapper at localhost:4191. This tests the built site, with local transport rather than Cloudflare's edge.
- Default mobile simulation: 150ms RTT, 1,638.4 Kbps throughput and 4× CPU slowdown. Desktop uses Lighthouse's desktop preset.
- Fresh headless Chrome profile for each audit. No extensions, visitor accounts or production analytics in the lab browser.
- Local text responses are uncompressed and cache-disabled. A read-only production check confirmed that Cloudflare already serves CSS with gzip. Local byte totals therefore are comparisons within this lab, not predicted production transfer totals. Cache behavior is tested separately against the generated Worker.
- Scores below are individual samples, not a statistical guarantee. Repeat runs varied, especially Interviews and the article. No field INP, real-device Safari or production Core Web Vitals claim is made.

## Latest mobile samples

LCP is the estimated time until the largest visible element paints. Lower is better.

| Page | Performance before → after | LCP before → after | Transferred before → after |
| --- | --- | --- | --- |
| Home | 93 → 100 | 2.41s → 1.20s | 202 → 159 KiB |
| Projects | 93 → 100 | 3.16s → 1.51s | 1,861 → 510 KiB |
| Interviews | 97 → 95 | 2.12s → 2.78s | 394 → 346 KiB |
| Writing | 97 → 100 | 2.40s → 1.35s | 175 → 153 KiB |
| Work | 96 → 100 | 2.55s → 1.35s | 246 → 148 KiB |
| Hackathon Part 2 article | 95 → 97 | 2.86s → 2.63s | 692 → 385 KiB |

The final mobile run recorded **CLS 0 and TBT 0ms on all six pages**. Accessibility, best practices and automated SEO scored 100 on all six. Those checks do not replace human accessibility review or establish search ranking.

Desktop samples for Home, Projects and Interviews scored 100 in those four categories, with CLS 0 and TBT 0ms. These desktop samples preceded the small fix that reserves mobile menu space; that fix applies only at mobile widths.

Interviews is not claimed as a measured speed improvement: its latest simulated LCP was slower, despite a smaller total transfer and faster first content paint (2.12s → 1.65s). Repeated post-change runs ranged from 95 to 99. The representative article also varied. Confirm their actual production timings before treating a single local result as a regression or a win.

## Changes backed by the audit

- Projects' initially requested image bytes fell from 1,659,084 to 262,048, about **84% smaller**. Separate small card previews preserve full gallery originals.
- Responsive article images reduced the representative article's total local transfer by about 44%. The original images remain packaged and article image alt text is retained.
- Work no longer downloads the 81KB project dataset. Interviews and Writing no longer download their collection datasets just to rebuild the same rows.
- Page content is generated at build time and retained in the browser. This avoids resetting images and reconstructing all 85 interview records after first paint.
- CSS is combined/minified, scripts are minified, and the tiny theme initializer is inline. No external web fonts are requested.
- Content-fingerprinted CSS/JS receive immutable caching only when the fingerprint matches the built bytes. HTML and ordinary text revalidate with ETags; conditional matches return 304.
- An early enhancement marker reserves the closed mobile-menu layout. This fixed a 0.058 CLS event caught in a retest. Without JavaScript, the marker is absent and ordinary navigation remains visible.
- Direct-linked readers receive focus inside the dialog. Title buttons, gallery controls, menu/theme controls and the reader close action retain usable targets and keyboard behavior.

The legacy CSS still includes styles needed by alternate pages, dialog states, themes and responsive layouts. The initial-view unused-CSS suggestion was not applied as a blind purge. The combined stylesheet is about 16 KiB when gzip-compressed locally; future cleanup should verify all those states.

## Actual browser and content checks

- Desktop dark/light layouts and narrow CSS viewports of 390px and 319px were inspected. Long titles wrap; there is no horizontal page or reader overflow. Temporary viewport settings were reset.
- Menu open/close, Escape, direct About → project links, browser history, gallery navigation/loading and focus restoration were exercised in Chrome. Story text remains 16px. Final preview logs contained no warnings or errors.
- The exact approved Solid join favicon remains unchanged, with working small PNG, ICO and touch assets.
- All personal page collections and page copy exist in the initial HTML. Projects has a complete no-script text fallback with working anchors. Public Markdown and llms.txt remain directly fetchable. Rendering crawlers are not assumed to click dialogs.
- Metadata, canonicals, sitemap, real 404s, article identity, all sharing cards and alt attributes passed packaged checks. Project ItemList links use the canonical HuddleDex anchor.
- Public noncanonical previews are noindex. The canonical production pages remain indexable. No private evidence archives, review notes, API keys or customer workflow files were added to the public build.
- Sixteen automated checks pass. Wrangler's local deployment dry run bundled successfully: about 230 KiB gzip for the Worker; no deployment occurred.

## Reproducing and following up

Build with `npm ci`, `npm run build`, and `npm test`. Start a compiled preview with `npx wrangler dev`, then run Lighthouse against that local port:

```sh
npx lighthouse@13.6.0 http://localhost:8787/projects --chrome-flags=--headless=new --output=json --output=html
```

Add `--preset=desktop` for desktop. Keep reports in ignored `outputs/`. The current before/after reports and screenshots are stored there; this document preserves the conditions and results in Git.

After an authorized deployment:

1. Run the release's live verifier and inspect real compression, cache headers, fingerprinted assets, redirects, metadata and representative sharing images.
2. Inspect the main sections and an article in Search Console and check the sitemap. Refresh third-party sharing caches where necessary. Check public preview noindex headers separately.
3. Use actual traffic for field LCP, CLS and INP, plus a real iPhone/Safari check. Revisit Interviews and image-heavy articles using production measurements. Local Lighthouse does not establish discoverability, indexing, rankings or LLM citations.

## Primary references

- [Official Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli)
- [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google's guidance on lazy-loaded content](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)
- [W3C dialog-opening button behavior](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [W3C focus visibility](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [W3C enhanced target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
