# Releases and rollback

## Naming and source of truth

- `main` is production. Work stays on `feat/<short-description>`, `fix/<short-description>` or `release/vX.Y.Z` until reviewed.
- Tags use `vMAJOR.MINOR.PATCH`. A substantial design, content or feature update increments MINOR; small corrections increment PATCH. MAJOR is reserved for a fundamental rebuild or incompatible deployment change.
- `package.json`, the lockfile and the release tag must agree. v1.0.0 predates package version reporting and is the preserved original baseline.
- Commit messages say what changed, such as `Refine mobile navigation spacing`. PR titles describe the final visitor-facing behavior. Use one release PR for an accumulated batch, with its change summary and validation.
- Never move an existing release tag or force-push production history. GitHub Releases hold the durable notes, source snapshot, compiled backup and checksums. The current deployment reports its version and commit at `/version.json` without adding UI clutter.

## Normal publishing

1. Start a branch from current `main`. Make changes and preview with `npx wrangler dev` after building. This local preview does not publish anything. Cloudflare preview builds are currently disabled.
2. Update `CHANGELOG.md` and the package version, including the root package entry in the lockfile. Run `npm run metadata` or `npm run project-text` when their source content changes. Regenerate sharing images only when needed.
3. Run `npm run build`, `npm test`, and `git diff --check`. Review relevant pages on desktop/mobile in both themes. Inspect staged files for private material. Commit and open a PR.
4. Wait for **Check website / build-and-test** to pass on the final PR commit. Merge the PR with a merge commit so the release batch has a single revert point. The code does not enforce branch protection, so this is a required maintainer practice.
5. Cloudflare Builds automatically builds/tests `main` and deploys. Do not run a second manual deployment while it is publishing.
6. Rebuild the clean merged checkout locally, then run `npm run verify:live -- X.Y.Z FULL_MERGE_SHA`. Confirm the live page visually as well. A failed build leaves the previous deployment live; investigate before calling it published.
7. Publish the GitHub Release `vX.Y.Z` targeting that exact merged SHA, with the matching changelog notes. **Archive website release** rebuilds/tests the tag, checks the version, and attaches `website-vX.Y.Z.tar.gz`, `manifest.json` and `SHA256SUMS`. Confirm this job passes and the assets appear before calling the backup complete.

## Undoing an update

The normal route is a rollback PR. Use GitHub's **Revert** on the release's merged PR, or `git revert -m 1 FULL_MERGE_SHA` on a new branch. Review conflicts, run the checks and merge. This restores the earlier behavior through new history rather than deleting commits. Record why in the PR and the next patch release. Reverting v1.1.0 also removes the new release tooling, so use the v1.0.0 checks/notes for that original baseline, then reintroduce any desired tooling separately.

For an urgent broken-site incident, Cloudflare's Deployments view can roll back to a retained version. The original v1.0.0 Worker version is `c79aa8a8-1f7f-45a5-8147-40c81c5ca719`. Record the current version first, verify the restored pages, and then reconcile `main` with a rollback PR before any further merges. A later automatic build can otherwise overwrite the emergency rollback. [Cloudflare rollback reference](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

If Cloudflare no longer retains the desired version, download its compiled GitHub release archive into an empty folder, verify `SHA256SUMS`, extract it, and check every manifest file hash before deploying. `npm ci` installs the pinned Wrangler; `npx wrangler deploy` deploys the already compiled `dist/` using `wrangler.jsonc`. This deliberately bypasses rebuilding and requires the existing authorized Cloudflare login. Do not put any credential into the archive. v1.0.0 has a GitHub source snapshot rather than a compiled archive: check out that tag in a separate folder, then build/test/deploy it.

No rollback has been performed on production just to test this procedure. Source builds, clean-checkout packaging and live identity checks are verified separately.
