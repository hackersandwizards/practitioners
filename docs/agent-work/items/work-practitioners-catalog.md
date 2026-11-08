---
kind: work
status: open
priority: 2
order: 60
owner: Ada
evidence: "No catalog in this repository on 08.11.; os, website and trainer-hub serve theirs with scaffolding's catalog preset."
---

# A design-system catalog at /catalog/

Serve every component of this repository at `/catalog/` with scaffolding's catalog preset, one
story per component on real entries, linked from the header and held by a coverage test. Add
`brand-elements.json` with `check:elements` over the catalog and the real pages, and wire
`brand-copies` and `brand-retired` into the gate.
