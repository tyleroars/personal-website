# Architecture

itstyleryip.com is Tyler Yip's public portfolio: projects, writing, work history and GradSimple interviews. It has no visitor accounts, backend database, payments or private customer workflows.

`src/` holds public HTML, CSS, vanilla JavaScript, media and agent-readable text. `scripts/build.mjs` creates static metadata, structured data, sitemap and a Cloudflare Worker containing text responses. `production-pages.mjs` uses the existing page template at build time so the browser preserves the HTML. It generates responsive media with Sharp and minifies scripts and combines CSS with esbuild. Raster media and the public HuddleDex starter ZIP are served through the `ASSETS` binding. Node 22 builds the site; Wrangler deploys it.

The browser enhances public HTML, opens project readers and stores the theme choice locally. The About rainbow is original canvas animation. The HuddleDex browser adaptation uses IndexedDB on the visitor's device with synthetic examples; it does not access Tyler's private app data.

GitHub is the source of truth. Pull requests get build checks. Merging to `main` triggers Cloudflare Builds, whose credentials remain outside this repository. Releases pin a source commit and archive the compiled Worker and assets.

## Boundaries and assumptions

- All files in `src/` are public by design, because the build copies this directory. Keep private evidence and QA material under ignored `outputs/`, outside `src/`.
- `src/projects.js` supplies the project list, interactive readers, no-script text fallback and synchronized agent documents. Production HTML is rendered from the page template in `src/site.js`; `data-prerendered` prevents runtime rebuilding. Source HTML remains a raw preview fallback. The template boundary is checked during build.
- Responsive previews, guest portraits, mascot and article media are generated under content-hashed paths. Full project gallery sources and originals remain available. CSS/JS fingerprints and ETags are computed from final built bytes. Only matching fingerprints receive immutable caching.
- The Worker serves only GET/HEAD documents and public static assets. It has no authenticated operations or secret runtime bindings.
- External app and story links leave this site's boundary. Historical demos can become unavailable; screenshots and captions document their actual scope.
- `src/huddledex-browser/index.html` imports notebook data into browser storage. Its sample and exported data are the visitor's responsibility; clearing site data removes it. It is not a secure shared database.
- CI passes are checked before merging as an operating practice. Repository branch protection is not asserted by this codebase.
- No transactional emails; `mailto:` opens the visitor's mail application. No `emails.md`.
- No scheduled jobs. No `cron.md`.
- No embedded AI agent, API key, server-side LLM call or webhook. Project descriptions and copyable prompts are public content. No `automation.md`.

## Related documents

- [Release and rollback guide](releases.md)
- [Trust-boundary flows](flows.md)
- [Permissions](permissions.md)
- [Configuration and secrets](variables.md)
- [Verification map](tests.md)
- [Site-wide design and agent QA](site-wide-qa.md)
- [Search and agent-facing routes](seo.md)
- [Changelog](../CHANGELOG.md)
- [Project writing and evidence](content.md)
