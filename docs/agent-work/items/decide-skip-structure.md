---
kind: decision
status: decided
priority: 3
order: 1962
owner: Benedikt
area: software-engineering
decision: "Allow the three contributor hook paths individually, adopt the pinned bunfig.toml, and enable the structure step."
by: Benedikt
evidence: "Scaffolding v5.31.0 reported 17 findings. Commit 66d9d72 repaired 13, leaving three contributor hooks and bunfig.toml."
---

# Practitioners scaffolding structure

The structure step runs in `bun run check`, including the check for rules enabled in both
Oxlint and ESLint on the same code. The repository adopts scaffolding's pinned `bunfig.toml`,
which makes Bun save new dependencies at exact versions.

Each contributor hook has its own exact-path structure allow entry in `package.json`.
Practitioners can commit and push a bio from a fork without gitleaks or the confidential-terms
list. The custom `.githooks/pre-commit` and `.githooks/pre-push` continue to handle these commits
and pushes, and `.githooks/commit-msg` remains absent.
