# It's Tyler Yip

My personal website at [itstyleryip.com](https://itstyleryip.com). A home for the things I've built, written and worked on, including the experiments that didn't work out.

The site brings together 14 projects, 21 articles and 85 GradSimple interviews. Built with HTML, CSS and vanilla JavaScript, with a small Cloudflare Worker for routes, redirects and response headers.

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
- `scripts/launch.test.mjs`: checks routes, metadata, public resources, galleries, portraits, agent links and response headers.
- `launch-data.json`: canonical domain and article metadata.
- `wrangler.jsonc`: Cloudflare deployment and custom domains.

The build is dependency-free. Wrangler handles local preview and deployment. Generated files live in `dist/` and are not committed.

## Publishing

Changes to `main` run the build checks in GitHub Actions and automatically publish through Cloudflare Builds to [itstyleryip.com](https://itstyleryip.com). Cloudflare builds with `npm run build && npm test` and deploys with `npx wrangler deploy`. Preview builds are disabled. Hosting credentials stay in Cloudflare, outside this repository.

For a manual deployment from an authorized Cloudflare account, use `npm run deploy`.

The apex domain is canonical. `www` redirects to it. Old `/about` and `/ai` links redirect to `/` and `/projects`. Pages and text revalidate; content-hashed images use long-lived cache headers. Unknown paths return a real 404.

## Content and privacy

This repository contains public portfolio material. It excludes private customer workflows, internal evidence archives, resumes and personal notebook data. The HuddleDex browser starter uses synthetic examples and keeps its data in the visitor's browser.

Writing and photographs belong to their respective authors. Interview excerpts link to the published GradSimple stories. Third-party icon licenses and attribution are included in `src/assets/icons/`.
