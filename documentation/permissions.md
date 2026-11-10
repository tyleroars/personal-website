# Permissions

| Resource / operation | Public visitor or bot | GitHub read-only user | Repository maintainer | Cloudflare deploy identity |
| --- | --- | --- | --- | --- |
| Read published HTML, media, Markdown and agent files | Yes | Yes | Yes | Yes |
| Change public source or merge to main | No | No | GitHub write permission | No source access beyond installed app grants |
| Create release / attach backup | No | No | GitHub release permission; Actions token for archival | No |
| Deploy or roll back Worker | No | No | Only with separately authorized Cloudflare access | Existing scoped account permission |
| Read/change visitor's HuddleDex notebook | Own browser only | Own browser only | No special access | No access |

GitHub and Cloudflare enforce their own account/repository permissions. The site has no session cookie, role claims, application login, database tables or row-level security. Public GET/HEAD routes in the Worker are intentionally unauthenticated. IndexedDB is origin-local browser storage, not a server access-control system.

The release workflow's `contents: write` token can attach files to this repository's releases. The normal check workflow has `contents: read`. No repository token or Cloudflare credential belongs in `src/`, `dist/`, release manifests or user-facing JavaScript.
