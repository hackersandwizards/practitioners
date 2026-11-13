---
kind: work
status: open
priority: 3
order: 2060
owner: Ada
area: software-engineering
evidence: "docs/agent-work/2026-11-11-performance.md: mobile LCP of / at 906, 907, 945, 1001, 3007 and 3086 ms over six runs with identical bytes; mobile weight 431,885 bytes against 287,592 on 09.11."
---

# Explain the overview's two-speed mobile LCP and split its weight rise

Brief a practitioners session to explain the overview's 3 s mobile LCP runs and split its 144 KB rise.

Both stay open from the performance run of 11.11. The LCP element is the same intro paragraph in all
six runs, and neither the observed render delay nor the load average separates the slow pair. For
the weight, build `8112867` and the current `main` with the same set of `active` entries, so the six
more portraits and the brand raises since v1.64.0 are measured apart. Done when the report names
the cause of each, measured with a control that changes one factor.
