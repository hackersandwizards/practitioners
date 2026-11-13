---
kind: decision
status: open
priority: 2
order: 400
owner: Benedikt
area: software-engineering
evidence: "13.11.: gh api repos/hackersandwizards/practitioners/collaborators lists 40 accounts with push, none direct or outside, so the write access comes through org membership; ruleset protect-default-branch holds only non_fast_forward and deletion; two bio edits reached main through GitHub's web editor (committer web-flow), with no pull request, so neither the hook nor pull-request.yml ran and export.test.ts went red until h&w regenerated entry.json"
recommended: a
options:
  - key: a
    label: Require a pull request on main, admins bypass
    detail: The ruleset protect-default-branch gains the pull request rule; its bypass list already holds the repository admin role, so h&w's own pushes and agent runs keep working. A trainer's edit in GitHub's editor then opens a pull request, which runs gitleaks, the folder check and astro check.
  - key: b
    label: Remove the trainers' write access
    detail: Trainers work from forks, as CONTRIBUTING.md already describes. Their org team loses write on this repository; their forks are unaffected.
  - key: c
    label: Keep it as it is
    detail: Trainers keep pushing to main directly. h&w regenerates entry.json after each such edit (practitioner-bio says so), and nothing checks what they push.
---

# Should trainers with write access keep committing straight to main?

Benedikt picks a, b or c. Changing a repository setting or a collaborator's access is his call.

This repository is public. Forty accounts hold write access through the org, trainers among
them. A commit they push to `main`, which GitHub's web editor does by default for such an
account, skips the pull-request workflow, so no gitleaks scan, folder check or `astro check` runs.
It also skips the local hook. Such a commit can change any folder, `scripts/` or `.githooks/`, and
the hooks run on h&w's machines at the next commit there. On 13.11. the only effect was a stale
`entry.json`. h&w regenerated it, and the gate is green again.
