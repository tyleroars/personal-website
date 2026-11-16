# Tyler Yip: Token Usage

The personal account token activity returned by OpenAI’s documented account/usage/read endpoint. Updated 2026-11-16T15:57:05.387Z.

- Account total: 31,049,051,289 tokens.
- Daily total: 31,049,051,289 tokens.
- Returned date range: 2026-03-20 to 2026-11-15.
- Days with activity: 194.

## One source for every total

The headline and daily, monthly, weekday and cumulative token charts use this same account report. Each grouping must reconcile exactly to the account total before export. Missing or mismatched data stops refresh and leaves the previous public snapshot intact. No SQLite thread-counter sum, local-log reconstruction, scaled values or invented breakdowns are used.

The endpoint’s field is named lifetimeTokens, but its documentation does not promise to include all historical ChatGPT conversations or a backfill to the account’s creation date. This returned report contains no dates before 2026-03-20. It must not be described as all ChatGPT use since 2023. Dates are shown as returned by the service; no undocumented timezone conversion is applied.

Work account activity is excluded. The service supplies account-wide daily totals and summary statistics, but no account-wide hour, model or token-type breakdown. Those partial local-log charts have been removed. Longest task follows the service’s longestRunningTurnSec field; it is not time spent actively working.

Only whitelisted summary numbers and daily totals are exported. No prompts, responses, thread IDs, names, file paths, account identifiers or credentials enter the public snapshot. Authentication is handled by the existing CLI; no credentials are copied. The local daily schedule refreshes this aggregate using the existing authenticated CLI. Once the Token Usage feature is released, data-only updates follow checked pull requests from production main; CI uses the saved snapshot and never contacts the account.

[Official endpoint documentation](https://learn.chatgpt.com/docs/app-server#7-token-usage-chatgpt) · [Interactive page](https://itstyleryip.com/tokens) · [Aggregate dataset](https://itstyleryip.com/data/token-usage.json)
