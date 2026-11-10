# Git hooks

Project-scoped hooks, enabled per clone by `bun install` (`git config core.hooksPath .githooks`).
The gate runs on the machine that makes the edit. A pull request skips it, so
`.github/workflows/pull-request.yml` runs only gitleaks, `bun run pull-request` and `astro check`
over its commits.

| Staged                                                        | Gate                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| anything but `src/content/`, `.claude/`, README.md, CLAUDE.md | `bun run check`: scaffolding's gate, its confidential audit of the index, brand's colour scan, the preview build |
| otherwise, a bio or portrait                                  | `astro check`, each `entry.json` fresh, and `check-confidential --staged --list-optional`: h&w's confidential list where the machine has it, a warning where it has none, a refusal where it is stale or broken; images are read by macOS OCR, and one it cannot read refuses the commit (CONTRIBUTING.md sends a portrait from another machine through the browser) |
| otherwise, `.claude/`, README.md or CLAUDE.md                 | `check-confidential --staged` in place of the optional scan: it needs the list |

First, each practitioner folder the commit touches must match the index, `entry.json` included, so
the checks read what the commit holds; a content commit also waits while any code outside
`src/content/` differs from it. The content row runs only the export test, so a practitioner's own
commit is never held to a count or list kept outside their folder; h&w runs `bun test` before a
content commit (`practitioner-bio`).

`pre-push` is scaffolding's own: it refuses a push that carries a commit listed in
`.confidential-purged.json`, the commits the history rewrite of 10.11. replaced, and reads no
confidential list, so a practitioner's push passes without one. After any further history rewrite,
add the replaced commits with `bun run --silent check-confidential purged <sha>... > .confidential-purged.json`,
then `bun run format`: the command keeps the staged list's salt and entries.
