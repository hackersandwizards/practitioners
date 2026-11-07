---
kind: decision
status: open
priority: 2
order: 60
area: people
owner: Benedikt
evidence: "GitHub API 06.11.: public, 3 admins and 37 collaborators with write, main unprotected, forking allowed, 0 open pull requests"
recommended: maintainers-only
options:
  - key: maintainers-only
    label: Write access only for the h&w colleagues who merge
    detail: "Everyone else contributes through a fork, which a public repository allows without any grant (GitHub opens the fork from the pencil icon). Every change to an entry then passes h&w's review. Changes 37 collaborator grants; nobody loses the ability to contribute."
  - key: protect-main
    label: Keep the 37 collaborators, require a reviewed pull request on main
    detail: "Branch protection on main. Collaborators keep branches in the repository itself; no direct push to main. Changes one GitHub setting."
  - key: as-is
    label: Leave access as it is
    detail: "Each of the 37 can push to main and change any entry without review. CONTRIBUTING.md asks for a pull request, nothing enforces it."
---

# Who may write to the practitioners repository now that everyone contributes by pull request?

`CONTRIBUTING.md` now sends every practitioner through a pull request that h&w reviews, and that
route needs no access grant. Today 37 people besides the three admins can push straight to `main`,
which has no branch protection, so any of them can change anyone's entry unreviewed. No setting was
changed.

Recommendation: `maintainers-only`. It closes the unreviewed path with no loss for contributors,
since a fork serves them as well as write access did. `protect-main` gives the same review with
more grants to keep track of.
