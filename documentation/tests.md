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
