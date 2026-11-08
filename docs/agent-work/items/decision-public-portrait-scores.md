---
kind: decision
status: open
priority: 2
order: 215
owner: Benedikt
area: people
evidence: "`gh repo view`, 08.11.2026: this repository is PUBLIC. `docs/agent-work/2026-11-08-portraits.md` names 33 people with their portrait scores; commit 67df25a held a report that named three of them as the lowest scored."
recommended: anonymise
options:
  - key: anonymise
    label: Anonymise the reports going forward, leave the git history
    detail: "The per-person tables of the portrait report move to a private repository and the public file keeps only the measurements. The names stay readable in the history of this public repository."
  - key: rewrite
    label: Anonymise and rewrite the published history
    detail: "As above, plus a force push of main that removes the names from history. Every clone and every pinned tag has to be redone, and copies already fetched stay out there."
  - key: keep
    label: Leave the scores public
    detail: "Nothing changes. Named portrait scores of trainers and partner staff stay findable in this repository."
---

# Named portrait scores in a public repository: remove them?

The rule on public repositories bars a person record, and I read a named score on a person's
portrait as one. Today's two portrait reports went onto public `main` with names; the later report
has been rewritten without them, the earlier one is left as it is, and it still lets anyone find
the lowest-scored people. Commit 67df25a also carries them in its history.

I recommend `anonymise`, because a history rewrite breaks every pin of this package for names that
already went out.
