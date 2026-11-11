---
kind: work
status: open
priority: 3
order: 2065
area: software-engineering
owner: Ada
evidence: "README run of 11.11. (505a3ec): the Caddy guide moved verbatim into docs/local-urls.md, testimonials (port 4327) added. Its report: the guide lacks admin (4329) and mail (4455), says every app prints its Caddy URL at start, which brand, documents, slides and mail do not, its port table is cut off at 390 px, and three code lines run past the box at 1280 px. docs/local-urls.md at origin/main, read 11.11. 18:00: line 164 'The console prints its Caddy URL.'"
---

# The local URLs guide: two apps missing, one wrong sentence, a table cut on phones

Ada briefs a practitioners session to fix the four points below in docs/local-urls.md; it ends on the green gate.

- Add admin (port 4329) and mail (port 4455), read from each repository's own config.
- "The console prints its Caddy URL" holds for some apps only; brand, documents, slides and mail
  print none. Say which do.
- The port table is cut off at 390 px; turn it into a list or a narrower table.
- Three code lines run past the code box at 1280 px; break them.

The guide is linked from os, talks, trainer-hub and website READMEs, so its file name and headings
stay.
