---
kind: decision
status: assumed
priority: 2
owner: Benedikt
area: people
evidence: "docs/agent-work/2026-11-08-practitioner-profile.md: a self-rated 1-to-5 scale scored 4.83 on clarity, depth by what was done 8.0"
recommended: self-declared
options:
  - key: self-declared
    label: The trainer declares, h&w keeps its own evidence privately
    detail: "Depth and topics on the public profile are what the trainer states. Company OS records what h&w saw (trainings delivered, attendee feedback) next to it, privately, and matching weighs both."
  - key: verified
    label: h&w confirms each level before it is public
    detail: "A value goes public only after h&w saw it in a delivery or a call. More trust for a client reading the page; every value waits until h&w has seen it."
  - key: badge
    label: Self-declared, with a public mark where h&w has seen it
    detail: "Like Toptal's verified expert badge. Needs a public field per value and a public statement about each trainer's past deliveries."
order: 670
---

# Who vouches for the depth and topics on a public profile

Blocks nothing. The assumption stands unless you veto it.

The profile shipped as `self-declared`: the trainer states depth (`used`, `shipped`, `leads`, the
`teaches` flag), topics and rooms trained, and h&w checks only that the pull request is theirs. Each
depth step names something done rather than a rating, which reviewers trusted more than a 1-to-5
self-rating. Whether h&w vouches for these values in front of a client is a choice about the
relationship with trainers and with clients.
