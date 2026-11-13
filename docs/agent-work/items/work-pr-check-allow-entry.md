---
kind: work
status: open
priority: 3
order: 2050
owner: Ada
area: software-engineering
evidence: "scaffolding v5.24.2 bin/scaffolding.ts (read 13.11.): the repository's own steps run only `if (ok)` after the shared group, which holds `confidential`"
---

# Find a full-gate route for a pull request whose author's name needs a new allow entry

Brief a practitioners session to find and test that route, then write it into `practitioner-bio` step 2.

A practitioner whose name is on the confidential list and has no `scaffolding.allow` entry yet
opens a pull request. The entry goes on `main`, since the pull request's folder check refuses
`package.json`, so the head the reviewer checks lacks it. There `bun run check` fails
`confidential` on the person's own name and stops before `check:colours`, `check:copies`,
`check:preview`, `check:elements` and `check:retired`. The skill now says the check counts only
once it passes in full, but names no route to that.

Two candidates, neither tested:

- Merge `main` into the checked head and push that merge with `entry.json`. Open: whether the
  pull request's CI folder check (`$BASE...$HEAD` with `github.event.pull_request.base.sha`) then
  sees `main`'s own changes as the pull request's and refuses `package.json`, and whether one
  checkout can commit the entry on `main` while `bun run export` has left `entry.json` modified.
- Run the full check on a throwaway worktree of the head merged with `main`, and push only from the
  head itself.

Done when one route ran on a scratch pull request: `bun run check` reports `passed` with
`check:preview` in its log, the CI folder check passes, and the skill names that route.
