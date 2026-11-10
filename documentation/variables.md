# Configuration and secrets

| Name | Used by / scope | Source | Rotation and risk |
| --- | --- | --- | --- |
| `origin`, article metadata | Build and public output | `launch-data.json` | Public canonical domain, not secret. Update redirects/metadata together if domain changes. |
| `version` | Build, release manifest, public version.json | `package.json`, package lock | Public release identifier; match immutable Git tag. |
| Git HEAD and dirty status | Build and public version.json | Local Git checkout | Public commit ID and boolean only. No branch names, environment dump or filesystem paths are exposed. |
| Worker name, domains, compatibility date | Wrangler / server routing | `wrangler.jsonc` | Public configuration. Changing domains affects live traffic. |
| `ASSETS` | Worker runtime binding | Cloudflare/Wrangler asset upload | Public compiled assets only; no credentials. |
| Cloudflare build/deploy credential | Cloudflare Builds, server-side deployment | Existing Cloudflare dashboard configuration | Never in Git. Revoke/rotate in Cloudflare if compromised; reconfigure the build credential there. |
| Local Cloudflare OAuth login | Authorized manual operator | Wrangler's external login storage | Never copy into repo or release. Reauthenticate/revoke through Wrangler/Cloudflare as needed. |
| `GH_TOKEN` | Release job only | Ephemeral `github.token` with repository contents write | Automatically expires after the job. Never echoed, written into the archive or sent to browser. |
| `RELEASE_TAG` | Release packaging job | GitHub release event | Public input, must exactly equal `v` plus the package version. |
| `GITHUB_REPOSITORY` | Release upload job | GitHub Actions context | Public repository target; script does not accept a secret-based alternate endpoint. |
| `tyler-theme` / `tyler-rainbow-seen` | Browser localStorage / sessionStorage | Visitor's browser | Theme preference and animation state only. Storage denial is tolerated. |

There are no secret runtime values bundled client-side. `src/` includes public contact details and portfolio evidence deliberately approved for publication. `.env*`, local review output, dependencies, compiled output and Wrangler login state are ignored by Git. Review newly staged files before every release; ignored status alone does not make a file safe if it is copied into `src/`.

Before publishing: verify intended domains and package version, run build/tests, inspect staged files and compiled archive, confirm no private notebook/customer material, and confirm the existing deployment credential is available to Cloudflare Builds. No new credential is needed for this release.
