# Search, sharing and agent access

| Routes | Indexed? | Content boundary |
| --- | --- | --- |
| `/`, `/projects`, `/writing`, `/work`, `/interviews` | Yes | Approved public portfolio data |
| `/writing/<article-slug>` (21 articles) | Yes | Public article text and images |
| `/huddledex-browser/` | No, follow allowed | Public synthetic browser starter; no private notebook |
| `/llms.txt`, `/llms-full.txt`, `/*.md`, `/writing/*.md` | Noindex response header, fetchable | Public alternate text; no private career evidence |
| `/version.json` | Noindex response header | Version, commit SHA, dirty boolean only |
| Unknown routes | Genuine 404, noindex | No application fallback or leaked files |

Metadata and structured data are present in the initial Worker HTML for both bots and people; there is no user-agent split. `page-metadata.json` supplies page-specific titles/descriptions. `share-images.json` maps each route to a checked-in 2400 × 1260 PNG with absolute production URL, type, dimensions and alt text. Article schema uses the actual article headline/date and body images.

The build renders all collection rows and page copy before JavaScript runs. Projects includes a usable no-script story fallback from the same public data. With JavaScript enabled, full stories open in dialogs; a rendering crawler is not assumed to click those buttons. The complete project Markdown and agent profile remain directly fetchable alternatives. This improves access without claiming that every crawler will index dialog copy or use llms.txt.

Production canonicals remain HTTPS URLs on itstyleryip.com. Public noncanonical preview hosts receive `X-Robots-Tag: noindex, follow`; production HTML stays indexable. Local loopback previews are exempt from that response header for accurate lab SEO checks, but are not publicly discoverable. Private working notes and source archives are outside the public build.

`scripts/page-metadata.mjs` escapes metadata attributes; structured JSON replaces literal `<` before insertion into script tags. These values are repository-managed, not visitor inputs. Sitemap includes 26 canonical HTML routes and excludes demos/agent alternates/version data. HTTPS, www, .html and old section aliases redirect to canonical routes. HTTP Link headers advertise Markdown and llms.txt. Agent profiles are synchronized from current public project data.

Generated metadata and sharing-image checks fail on missing or inconsistent files. `verify-live.mjs` checks the deployed version, page metadata, sharing images and actual public agent documents after deployment. Search ranking and third-party preview cache refresh are not guaranteed by metadata; share-image URLs are fingerprinted so new images get new URLs.

After deployment, verify real response compression/caching and canonical redirects, inspect representative URLs in Search Console, submit the sitemap if needed, and refresh third-party sharing caches. Field Core Web Vitals require production traffic; local Lighthouse results cannot establish field INP, ranking or AI citation behavior. See [the performance audit](performance.md).
