# It's Tyler Yip

My personal website at [itstyleryip.com](https://itstyleryip.com). A home for the things I've built, written and worked on, including the experiments that didn't work out.

The site brings together 15 projects, 21 articles and 85 GradSimple interviews. Built with HTML, CSS and vanilla JavaScript, with a small Cloudflare Worker for routes, redirects and response headers.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run build
npm test
npx wrangler dev
```

## How it's organized

- `src/`: public pages, articles, project data, photos, icons and agent-readable documents.
- `scripts/build.mjs`: produces the Worker and static media, adds canonical/social metadata, structured data, sitemap and robots.txt.
- `page-metadata.json`: clear search titles and descriptions for every section, article and the demo.
- `scripts/sync-metadata.mjs`: `npm run metadata` syncs that copy into the source pages and the article indexes in the agent documents.
- `scripts/sync-project-text.mjs`: `npm run project-text` syncs project descriptions, stories, outcomes, workflows and public links from `projects.js` into `projects.md`, `llms.txt` and `llms-full.txt`.
- `scripts/create-share-image.mjs`: `npm run share-image` regenerates 2400 × 1260 cards for every page. The checked-in PNGs and `share-images.json` let ordinary builds use them without rendering images. Arial is used for optional regeneration.
- `scripts/launch.test.mjs`: checks routes, metadata, public resources, galleries, portraits, agent links and response headers.
- `launch-data.json`: canonical domain and article metadata.
- `wrangler.jsonc`: Cloudflare deployment and custom domains.

The build is dependency-free. Wrangler handles local preview and deployment. Generated files live in `dist/` and are not committed.

## Publishing

Use the [release and rollback guide](documentation/releases.md) for the exact process. [CHANGELOG.md](CHANGELOG.md) records each release, and [GitHub Releases](https://github.com/tyleroars/personal-website/releases) preserves its source and verified deployment backup. `/version.json` identifies the version and source commit currently live. The [architecture index](documentation/architecture.md) maps the system, permissions and verification coverage.

Changes to `main` run the build checks in GitHub Actions and automatically publish through Cloudflare Builds to [itstyleryip.com](https://itstyleryip.com). Cloudflare builds with `npm run build && npm test` and deploys with `npx wrangler deploy`. Preview builds are disabled. Hosting credentials stay in Cloudflare, outside this repository.

For a manual deployment from an authorized Cloudflare account, use `npm run deploy`.

The apex domain is canonical. `www` redirects to it. Old `/about` and `/ai` links redirect to `/` and `/projects`. Pages and text revalidate; content-hashed images use long-lived cache headers. Unknown paths return a real 404.

When adding a page, add its metadata, run `npm run metadata` and `npm run share-image`, then build and test. The build fails if a page lacks metadata or a sharing image. Each article keeps its original visible headline and publication timestamp; its search title may explain the subject more directly. Publication dates in cards and Markdown match the Vancouver date shown on the article.

After changing project copy, run `npm run project-text` before building and testing. The checks compare the descriptions, stories, outcomes and workflows with all three agent documents so content drift is caught before publishing.

All public HTML includes its metadata and content before JavaScript runs. Article structured data uses the original headline, author, publication timestamp, and images actually present in the article. HTTP `Link` headers expose Markdown alternatives and `llms.txt`. Markdown and agent files remain fetchable, with `noindex` headers to keep search results focused on the canonical HTML. The browser demo is also `noindex` and excluded from the sitemap.

## Content and privacy

This repository contains public portfolio material. It excludes private customer workflows, internal evidence archives, resumes and personal notebook data. The HuddleDex browser starter uses synthetic examples and keeps its data in the visitor's browser.

Writing and photographs belong to their respective authors. Interview excerpts link to the published GradSimple stories. Third-party icon licenses and attribution are included in `src/assets/icons/`.
