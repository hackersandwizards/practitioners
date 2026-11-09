# Git hooks

Project-scoped hooks, enabled per clone by `bun install` (`git config core.hooksPath .githooks`).
The gate runs on the machine that makes the edit. A pull request skips it, so
`.github/workflows/pull-request.yml` runs only `astro check` and gitleaks over its commits.

| Staged                                                        | Gate                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| anything but `src/content/`, `.claude/`, README.md, CLAUDE.md | `bun run check`: scaffolding's gate, its confidential audit of the index, brand's colour scan, the preview build |
| otherwise, a bio or portrait                                  | `astro check` and each `entry.json` fresh                                  |
| otherwise, `.claude/`, README.md or CLAUDE.md                 | also `check-confidential --staged`, which needs h&w's confidential list     |

First, each practitioner folder the commit touches must match the index, `entry.json` included, so
the checks read what the commit holds.
