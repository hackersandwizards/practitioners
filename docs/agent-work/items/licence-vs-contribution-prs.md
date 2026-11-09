---
kind: decision
status: assumed
order: 1250
priority: 3
owner: Benedikt
area: legal
recommended: contribution-clause
options:
  - key: contribution-clause
    label: "Keep PolyForm Strict and add one contribution clause: a practitioner may change their own entry by pull request, and their text and portrait stay theirs"
    detail: "Keeps 'das soll keiner einfach so nutzen' and the repo's only workflow, entries edited by pull request."
  - key: strict-only
    label: "PolyForm Strict as it stands"
    detail: "Grants no right to make changes, so a practitioner's pull request on their own entry has no licence behind it."
---

# Does the practitioners licence need a clause for practitioners' own edits?

You asked for a licence "so wie die anderen repos" (v1.1.0 ships PolyForm Strict 1.0.0). That licence grants no right to make changes, while this repository's workflow is practitioners editing their own entry by pull request. I recommend one contribution clause, added in a practitioners release unless you object. Not built yet: `LICENSE` at v1.4.2 (09.11.) has no such clause.
