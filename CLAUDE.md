# CLAUDE.md

Context for Claude Code sessions in this repo.

## What Is This

The people behind hackersandwizards.dev/practitioners, one directory each under
`src/content/practitioners/<slug>/`: `bio.md` (frontmatter plus the English text), `bio.de.md`
(the German text) and `photo.webp`. Optionally `bio.short.md`, a version of the English bio
capped at 300 characters for conference CfPs and speaker forms; no collection loads it, so it is
storage only and the website never renders it. The website copies the approved bios into its own pages.
Who is shown there, in which group and with which title, is the website's roster and lives only
there.

The one workflow is the `practitioner-bio` skill in `.claude/skills/`: it completes an entry by
mail, the default, or by interview, and commits once the person approves the exact text and
consents to publication. A practitioner edits their own entry and nobody else's.

## Gate

There is no CI. `src/lib/schema.ts` is the contract; `.githooks/pre-commit` runs `astro check`
against it when a bio is staged and `bun run check` when anything else is. `bun install` enables
the hooks per clone.

## Git

Name the paths on `git commit` itself. Never `git add -A`, never a bare `git commit`. Commit a
bio only after the person it describes has said yes to exactly that content.
