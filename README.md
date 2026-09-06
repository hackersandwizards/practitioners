# Practitioners | hackers&wizards

The people on [hackersandwizards.dev/practitioners](https://www.hackersandwizards.dev/practitioners/),
one directory each: an English bio, a German bio, a portrait and the profile links they maintain.
The website reads this repo as a git submodule, so a change here is what a client reads there.

Who appears on that page, in which group and with which title is the website's roster and stays
there. This repo holds what each person says about themselves.

## Your entry

```bash
git clone https://github.com/hackersandwizards/practitioners.git
cd practitioners
bun install
bun run dev
```

Open Claude Code in the repo and say "create my bio". It asks for your links and a portrait,
interviews you for a few minutes, drafts the English and the German text, shows both at
http://localhost:4321 and commits when you approve. With write access, push to main. Without it,
fork and open a pull request.

## How it is checked

There is no CI. `src/lib/schema.ts` says what an entry is; the pre-commit hook in `.githooks/`
checks every staged bio against it on your machine, and the website build checks it again when it
pulls the submodule. `bun install` enables the hook.

## Layout

```
src/content/practitioners/<slug>/   bio.md, bio.de.md, photo.webp
src/lib/schema.ts                   the contract every bio.md meets
src/pages/index.astro               the preview, alphabetical
.claude/skills/practitioner-bio/    the interview
.githooks/                          the gate
```
