# Token usage and gallery delivery

Prepared November 11, 2026, on `feat/token-usage-and-gallery-performance`. This is a local preview update after v1.2.0, not a production deployment.

## Token page

`/tokens` now uses the documented OpenAI `account/usage/read` endpoint through the installed, already authenticated Codex CLI. The client initializes a new stdio app-server connection, reads account usage, and exits. It never proxies the running desktop app, starts or resumes a thread, starts a model turn, reads credentials, or copies chat contents. The refresh runs locally, outside the normal build. A daily 9:00 a.m. Vancouver scheduled task is configured separately; see [daily updates](token-usage-updates.md). It cannot publish this feature branch. CI uses the checked-in aggregate and never accesses the account.

The reviewed service response reports **30,496,989,481** lifetime tokens. Its 190 daily buckets sum to **exactly 30,496,989,481**, March 20–November 11, 2026. The returned peak is 1,226,305,080 on August 11; longest streak is 146 days; longest running turn is 41,123 seconds. These are profile/account statistics, not personal productivity measurements.

The headline, calendar, monthly totals, weekday totals and cumulative endpoint all use the same daily report. Missing totals, invalid/duplicate dates, invalid counts, an inconsistent daily sum or an inconsistent peak cause refresh to fail before writing any public file. Rendering also rejects a headline/daily mismatch or a non-account source. Missing dates inside the reported range contribute zero to the cumulative line without inventing usage. Months and weekdays aggregate by the exact service dates. Their timezone is not specified by the public response contract, so the code does not reinterpret them as Pacific timestamps or infer hours.

The endpoint returns no account-wide model, token-type or hourly breakdown. Those partial local-log views have been replaced by the account’s daily, monthly, weekday and cumulative views. No categories are rescaled to a larger total, and no missing detail is attributed to arbitrary models or hours. The native chart interactions retain pointer, touch and keyboard readouts, with a single focus stop per plot. Counts and all charts are in initial HTML; JavaScript enhances inspection.

The page is named Token Usage, keeps its stable `/tokens` URL and existing navy/sage palette, Codex Tokens metric label, two-sentence personal/work note, and no disclosure tables, source tabs, em dashes, credit block or methodology footer. Source and aggregate text remain accessible as separate routes and through the normal document link headers. Public schema version 4 contains only source metadata, scope, whitelisted service summary values and daily totals. No conversation, account, thread or project identifiers are exported.

### Coverage and the earlier discrepancy

The API field is named `lifetimeTokens`, but the fetched official documentation does not establish that it covers every ChatGPT conversation since an account’s creation or backfills older browser-chat use. This account report includes no dates before March 20, 2026, and its daily sum accounts for the entire returned lifetime figure. It must not be described as all ChatGPT use since 2023. Tyler confirmed that the account is personal and excludes his separate work usage.

The previous preview incorrectly used a sum of local SQLite thread counters, 32,106,365,437, as the headline, alongside a separate local-log reconstruction of 24,238,841,105. The resulting 7,867,524,332 difference was created by mixing metrics, not evidence of ChatGPT use in 2023–2024. Sampled forked sessions inherited the same 752,991,184 counter and then added their own work; a separate sampled primary session reset its counter nine times. Local retained logs also have different coverage from the account service. Neither local calculation was a verified account-wide lifetime statistic. The earlier raw observations remain in ignored `outputs/` and Git history; the old local parser is no longer part of the refresh path.

Source references: [official account-usage endpoint](https://learn.chatgpt.com/docs/app-server#7-token-usage-chatgpt), [official Profile settings](https://learn.chatgpt.com/docs/reference/settings#profile). The fetched protocol schema includes `summary`, optional `dailyUsageBuckets`, and a nullable per-thread billing breakdown. It provides no account-wide hour/model/token-type contract. No claim is made that the discrepancy is fully attributable to one inheritance or deletion mechanism.

## Project highlights

The current November 12 preview puts the project title first, followed by its description, a compact value/label outcome group and the preview. Values use the Work marker at 18px; labels are 12px, with a slim separator between multiple stats and no enclosing panel. A single web screenshot and a three-screen phone group share a 360px maximum width. Narrative outcomes inside opened readers retain the Work page’s `.work-highlight` marker. Existing supported figures and copy are unchanged. See [About and project refinement](about-project-refinement.md).

## Gallery delivery

The previous controller waited for navigation before requesting the next full image and hid the current image during loading. A sampled live HTTPS check of three event images returned cache hits in 32–228ms on this computer; that does not reproduce every visitor’s network or certify field performance.

All 51 gallery shots now get responsive display variants and small thumbnails at build time. Photograph compression and screenshot compression use different quality settings. Generated filenames hash final bytes. Cropped hero images download only the displayed crop. The originals remain packaged.

The current image reserves its footprint before decoding, with a tiny preview and clear loading/error feedback. After the selected image loads, only its next and previous neighbours are warmed at low priority. Warming uses the same responsive sizes as display, reuses the browser cache, and does not download every full gallery image in advance. Cached load completion is handled immediately; stale load events cannot clear a newer loading state. Existing endpoint hiding, keyboard navigation, gestures, captions and focus behaviour are retained.

For HuddleDex’s five event photos, 480px variants are 18.7–51.8KB, compared with 87.5–285.5KB originals. Retina-sized 900px variants are 44.3–173.3KB. Thumbnails are 1.3–2.1KB. These are file-size measurements, not measured live waiting-time reductions.

Automated checks verify all variant widths, file existence, a 350KB display-file ceiling, an 8KB thumbnail ceiling, adjacent warming, preview sizing, stale load handling and existing gallery navigation. Real production latency should be rechecked after an authorized release.

## Preview QA

The previous gallery pass checked all five HuddleDex event photographs on mobile, responsive files, endpoint controls, and exact project/Work highlight styling. See gallery delivery measurements above. The official-account Token revision is verified separately after rendering. No push or production deployment is part of this branch.

### Official-source verification, November 11, 2026

- Build and all 28 current tests pass. The new account-contract tests replace the retired local-log parser tests.
- Real browser: headline and cumulative endpoint both show 30,496,989,481. Keyboard Home reaches March 20’s 108,580; End reaches November 11’s full total. Monthly End shows November’s 3,626,503,676. Clicking the running chart selects the corresponding date and exact cumulative value.
- Reviewed dark/light desktop and the 319px layout. Document width remains 319px on the narrow view; the running chart’s axis labels retain 11px type. Restored normal desktop sizing and dark mode. No browser warnings/errors were reported.
- Fresh local Lighthouse 12.8.2 mobile sample: performance 96, automated accessibility 100, FCP 1.7s, LCP 2.6s, TBT 0ms, CLS 0.001, 251,883 uncompressed local bytes and 687 DOM elements. Default mobile network simulation and 4× CPU slowdown were used. This is one local lab sample, not production field performance. Report: ignored `outputs/performance/tokens-official-account-mobile.report.json`.
- Preview only. No Git push, release or deployment occurred.
