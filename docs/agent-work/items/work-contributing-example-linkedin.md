---
kind: work
status: open
priority: 3
order: 2066
area: software-engineering
owner: Ada
evidence: "CONTRIBUTING.md at origin/main, read 11.11. 18:00: the example bio.md (lines 80 to 86) carries a live-looking linkedin line, https://www.linkedin.com/in/ada-example/. A contribution of 11.11. copied it beside its own linkedin line, and the gate refused the pull request with 'Map keys must be unique'."
---

# CONTRIBUTING's example invites a contributor to copy a second linkedin line

Ada briefs a practitioners session to make the example's link lines impossible to copy by mistake.

A contributor who copies the example and adds their own line ends up with `linkedin:` twice, and the
build fails with a YAML error that does not say which line. Two ways, the session picks one and
says why: mark the example lines as placeholders the gate refuses with a clear message, or show
them as comments the contributor fills in. Either way the error a contributor sees names the line.
