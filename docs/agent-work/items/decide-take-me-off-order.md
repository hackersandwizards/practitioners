---
kind: decision
status: open
priority: 2
order: 420
owner: Benedikt
area: software-engineering
evidence: "src/lib/website.test.ts, test 'every slug the website lists has a folder here', added in c1a0b87 (12.11.); practitioner-bio's Request section deletes the folder first, then flags the roster change"
recommended: a
options:
  - key: a
    label: Delete here at once, the roster test tolerates it
    detail: The folder goes in the same run as the request. The roster test accepts a slug the website still lists for a stated window, or reports it without failing, so no gate turns red meanwhile.
  - key: b
    label: Delete here at once, accept the red gate
    detail: The folder goes in the same run as the request. bun run check, and the hook of every commit touching code or docs, stay red until the website drops the slug.
  - key: c
    label: Wait for the website, then delete here
    detail: The gate stays green throughout. The profile stays public in this repository until the website has dropped the slug.
---

# In which order does a take-me-off request remove a trainer?

Benedikt picks a, b or c: how fast a request to leave is honoured is his call.

A trainer asks to be taken off. `practitioner-bio` deletes their folder here first and then asks
for the website roster change. From that deletion until the website drops the slug, the test
"every slug the website lists has a folder here" in `src/lib/website.test.ts` fails, and with it
`bun run check` and the hook of every commit touching code or docs. That test came in with
`c1a0b87` on 12.11., before today's polish run; the run's change to the same file (`75faf7c`) only
makes a missing `/team.json` fail and does not touch this test. Waiting for the website instead
keeps the gate green, but leaves the profile public here in the meantime.
