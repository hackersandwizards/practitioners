# Git hooks

Project-scoped hooks, enabled per clone by `bun install` (`git config core.hooksPath .githooks`).
There is no CI: the gate runs on the machine that makes the edit.

| Staged                                                        | Gate                                                                        |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- |
| anything but `src/content/`, `.claude/`, README.md, CLAUDE.md | `bun run check`: scaffolding's gate, brand's colour scan, the preview build |
| otherwise, a bio or portrait                                  | `astro check`: frontmatter against the schema                               |
| anything outside `src/content/`                               | also `check-confidential --staged`, which needs h&w's confidential list     |
