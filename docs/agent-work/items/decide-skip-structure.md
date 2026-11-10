---
kind: decision
status: open
priority: 3
order: 1962
owner: Benedikt
area: software-engineering
evidence: "check-structure of scaffolding v5.15.0, run read-only on 10.11.: 16 findings. Three are the skip's stated exceptions (pre-commit and bunfig.toml differ, commit-msg missing). The other thirteen are the entries the skip lists as not adopted with no reason recorded: .editorconfig, .npmrc, post-merge, post-checkout, .githooks/install and .githooks/session-start (new in v5.15.0), AGENTS.md, .mcp.json, .codex/config.toml, the .agents/skills link, the SessionStart hook in .claude/settings.json, engines.npm and the check:staged script."
options:
  - key: a
    label: Take the rest of the skeleton
    detail: "A session replaces skip.structure with one allow entry of check structure for each of the three exceptions (pre-commit, commit-msg, bunfig.toml), then runs check-structure --fix, which writes nothing where an allow entry covers the path and writes eight of the thirteen entries; AGENTS.md, .mcp.json, .codex/config.toml, engines.npm and the check:staged script it reports without a repair, so the session writes those by hand. The structure check then runs in the gate for everything else."
  - key: b
    label: Keep the skip, with a reason naming what still waits
    detail: "The thirteen entries stay out. The reason lists each and says what it waits for, so the next pin raise does not ask again. check-structure keeps checking nothing in this repository."
---

# Practitioners: take the rest of the scaffolding skeleton, or keep the skip?

Pick whether practitioners adopts the thirteen skeleton entries it still leaves out.

`scaffolding.skip.structure` in `package.json` switches the whole structure check off. Three parts of its reason are deliberate and stay under either option: a contributor committing their own bio must not need gitleaks or the confidential-terms list (CLAUDE.md, "Gate"), so pre-commit, commit-msg and bunfig.toml differ from the skeleton. For the thirteen other entries the reason says "not adopted yet, with no reason recorded". The pin raises to scaffolding v5.13.0 (db59d35) and v5.15.0 left them out too.

No file in the repository says whether the thirteen fit a contributor's clone, so there is no recommendation.
