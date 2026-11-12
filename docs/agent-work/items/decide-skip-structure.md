---
kind: decision
status: open
priority: 3
order: 1962
owner: Benedikt
area: software-engineering
evidence: "check-structure of scaffolding v5.24.2, run read-only on 12.11.: 18 findings; --fix writes nothing while skip.structure is set. One is .githooks/pre-push, which differs from the skeleton's (the skeleton's also runs scaffolding check --changed over each pushed range). Three are the skip's stated exceptions (pre-commit and bunfig.toml differ, commit-msg missing). The other fourteen are the entries the skip lists as not adopted with no reason recorded: .editorconfig, .npmrc, post-merge, post-checkout, .githooks/install and .githooks/session-start, .githooks/check-lock.ts (the copy of check-lock that .githooks/install runs), AGENTS.md, .mcp.json, .codex/config.toml, the .agents/skills link, the SessionStart hook in .claude/settings.json, engines.npm and the check:staged script. v5.17.0 and v5.17.1 changed four of them in the skeleton (check-lock.ts, install, post-checkout, session-start) and added none (git diff --stat v5.16.0 v5.17.1 -- template/ in the scaffolding checkout)."
options:
  - key: a
    label: Take the rest of the skeleton
    detail: "A session replaces skip.structure with one allow entry of check structure for each of the three exceptions (pre-commit, commit-msg, bunfig.toml), then runs check-structure --fix, which writes nothing where an allow entry covers the path and writes the other entries; AGENTS.md, .mcp.json, .codex/config.toml, engines.npm and the check:staged script it reports without a repair, so the session writes those by hand. The structure check then runs in the gate for everything else."
  - key: b
    label: Keep the skip, with a reason naming what still waits
    detail: "The entries the skip lists as not adopted stay out. The reason lists each and says what it waits for, so the next pin raise does not ask again. check-structure keeps checking nothing in this repository."
---

# Practitioners: take the rest of the scaffolding skeleton, or keep the skip?

Pick whether practitioners adopts the skeleton entries it still leaves out.

`scaffolding.skip.structure` in `package.json` switches the whole structure check off. Three parts of its reason are deliberate and stay under either option: a contributor committing their own bio must not need gitleaks or the confidential-terms list (CLAUDE.md, "Gate"), so pre-commit, commit-msg and bunfig.toml differ from the skeleton. For the other entries the reason says "not adopted yet, with no reason recorded". No pin raise since scaffolding v5.13.0 (db59d35) has adopted them.

No file in the repository says whether those entries fit a contributor's clone, so there is no recommendation.
