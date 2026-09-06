# CLAUDE.md

Context for Claude Code sessions in this repo.

## What Is This

The people behind hackersandwizards.dev/practitioners, one directory each under
`src/content/practitioners/<slug>/`: `bio.md` (frontmatter plus the English text), `bio.de.md`
(the German text) and `photo.webp`. The website reads this repo as a git submodule. Who is shown
there, in which group and with which title, is the website's roster and lives only there.

The one workflow is the `practitioner-bio` skill in `.claude/skills/`: it interviews a person,
drafts both bios, shows the result at `/` and commits once they approve. A practitioner edits
their own entry and nobody else's.

## Gate

There is no CI. `src/lib/schema.ts` is the contract; `.githooks/pre-commit` runs `astro check`
against it when a bio is staged and `bun run check` when anything else is. `bun install` enables
the hooks per clone. The website validates the same schema again in its own build.

## Git

Name the paths on `git commit` itself. Never `git add -A`, never a bare `git commit`. Commit a
bio only after the person it describes has said yes to exactly that content.
