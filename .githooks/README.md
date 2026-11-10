# Git hooks

Project-scoped hooks, enabled per clone by `bun install` (`git config core.hooksPath .githooks`).
The gate runs on the machine that makes the edit. A pull request skips it, so
`.github/workflows/pull-request.yml` runs only gitleaks, `bun run pull-request` and `astro check`
over its commits.

| Staged                                                        | Gate                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| anything but `src/content/`, `.claude/`, README.md, CLAUDE.md | `bun run check`: scaffolding's gate, its confidential audit of the index, brand's colour scan, the preview build |
| otherwise, a bio or portrait                                  | `astro check` and each `entry.json` fresh                                  |
| otherwise, `.claude/`, README.md or CLAUDE.md                 | also `check-confidential --staged`, which needs h&w's confidential list     |

First, each practitioner folder the commit touches must match the index, `entry.json` included, so
the checks read what the commit holds; a content commit also waits while any code outside
`src/content/` differs from it. The content row runs only the export test, so a practitioner's own
commit never fails on a file outside their folder; h&w runs `bun test` before a content commit
(`practitioner-bio`).
