---
kind: decision
status: open
priority: 2
order: 70
area: people
owner: Benedikt
evidence: "gh repo view 07.11.: hackersandwizards/practitioners is PUBLIC; polish review 07.11. of docs/agent-work/items/"
recommended: move-to-os
options:
  - key: move-to-os
    label: Keep this repository's work items in the Company OS
    detail: "The mail round, write access and publication items move to the private Company OS, and this repository keeps only CONTRIBUTING.md, the skill and the code. The admin hub reads them from there. Nothing about a person's mail, consent or departure stays public."
  - key: trim-in-place
    label: Keep the items here, cut every person-level detail
    detail: "The items stay, but name no recipient, no sender address, no schedule and no one whose entry lacks their yes. Smaller change; each future item needs the same care."
  - key: as-is
    label: Leave the items as they are
    detail: "The mail plan, who gets which mail and which active entries lack their person's yes stay readable by anyone."
---

# Should this public repository hold work items about people?

`.claude/rules/local-documents.md` keeps person records and company data out of a public
repository. This repository is public, and its items record a mail round (sender address, send
time, who gets which mail), which `active` entries lack their person's yes, and the names the
confidential list holds, which the allow entries in `package.json` then have to spell out. The
polish run of 07.11. removed a departure line and the text of mails not yet sent, and changed
nothing else.

Recommendation: `move-to-os`. It ends the leak for every future item, where `trim-in-place`
depends on each session remembering it.
