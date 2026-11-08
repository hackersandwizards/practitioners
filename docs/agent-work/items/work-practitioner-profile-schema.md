---
kind: work
status: open
priority: 2
owner: Ada
evidence: "The profile fields ship in src/lib/schema.ts (docs/agent-work/2026-11-08-practitioner-profile.md). package.json has no `exports` and no release tag, so Company OS can read no entry without a sibling path."
---

# Publish the profiles for Company OS to read

Company OS matches trainers in its `trainer-inquiry` skill and needs the profile fields. Declare
`exports` in `package.json` for `src/lib/schema.ts` (the fixed lists and their labels) and the
entries under `src/content/practitioners/`, tag a release, and name it in the commit, so os pins
the tag instead of reading this checkout. Held while the catalog run keeps `package.json`
uncommitted.
