# CLAUDE.md

Context for Claude Code sessions in this repo.

## What Is This

The people behind hackersandwizards.dev/team, one directory each under
`src/content/practitioners/<slug>/`: `bio.md` (frontmatter plus the English text), `bio.de.md`
(the German text) and `photo.webp`. Optionally `bio.short.md`, a version of the English bio
capped at 300 characters for conference CfPs and speaker forms; no collection loads it, so it is
storage only and the website never renders it. The website renders its profiles from this package:
each folder's generated `entry.json` and `photo.webp` under the `./practitioners/*` export
(`bun run export` writes the `entry.json` files, `src/lib/export.test.ts` fails while one is stale). Who is shown there and
in which group is the website's roster and lives only there; every line about a person, title and
expertise included, lives here.

Each practitioner improves their own entry here by pull request (`CONTRIBUTING.md`), and that
change is their yes to the entry. The one workflow for h&w is the `practitioner-bio` skill in
`.claude/skills/`: it reviews and merges such a pull request, drafts the mail that asks for one, or
interviews the person. A practitioner edits their own entry and nobody else's; an h&w colleague
edits one only from that person's own words and commits it after their yes to exactly that
content. No public host serves a build while an `active`
entry carries neither its person's own change nor their yes to its text
(`docs/agent-work/items/practitioner-pages.md` names them).

## Catalog

`bun run catalog` (or `bun run dev`) serves it at practitioners.localhost/catalog/: scaffolding's
catalog preset in `astro.config.ts`, one story per component in `catalog/stories/` on real entries
(`catalog/coverage.test.ts` holds that), the brand elements the pages use on its home. It shows
drafts, so it builds only where drafts render: the dev server and the gate's preview build.

## Gate

`src/lib/schema.ts` is the contract; `.githooks/pre-commit` runs `astro check` against it when a
bio is staged, and `.githooks/README.md` lists what else it runs for which path. `bun install`
enables the hooks per clone. A pull request skips them, so `.github/workflows/pull-request.yml`
runs `astro check` and gitleaks over its commits; that is the only CI. It skips `bun run check`
and `check-confidential`, which a reviewer runs locally (`practitioner-bio`).
