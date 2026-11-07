---
kind: review
status: assumed
priority: 3
owner: Benedikt
area: people
evidence: "Blind review 07.11., 2 personas, round 1 Claude twice and Codex once each, round 2 Claude and Codex once each; screenshots at 1440 and 375 px beside hackersandwizards.dev/team/"
recommended: filter-grid
options:
  - key: filter-grid
    label: The website's card, alphabetical, with a name field and a status switch (shipped)
    detail: "Four columns at 1440 px and two on a phone, 244 px cards like the website's: portrait, name with an arrow, the website's role. Draft and Not on the website show as pills. A name field and a switch for all, drafts and people not on the website filter the grid. The whole card opens the person's page."
    score: 8.75
    noise: 0.5
  - key: website-order
    label: The same card in the website's order, then a second section for people not on it
    detail: "No name field; the first section follows the order of hackersandwizards.dev/team/."
    score: 7.17
    noise: 0
  - key: rows
    label: Compact rows with a round portrait, three columns
    detail: "The shortest page, but no longer the website's card."
    score: 6.17
    noise: 0
  - key: full-bio-cards
    label: The earlier overview, three large cards with both full bios
    detail: "Only the name opened the person's page."
    score: 3.5
    noise: 0
---

# The overview as a preview of the website's team grid

`/` now shows each person with the card hackersandwizards.dev/team/ uses. The role under each
name and whether the website lists the person come from the JSON-LD that the website's team page
publishes, read at build time (`src/lib/website.ts`). When the page cannot be read, the overview
says so and drops the role and the website filter. Detail pages are unchanged. The review's
screenshots stay out of this public repository: they show names of people the website does not
list, which the confidential check blocks.

## Blind review

Personas: a practitioner checking their own entry, and a client's CTO who knows the public team
page. Each saw the website's grid as reference and the candidates under shuffled neutral labels
at 1440 and 375 px, with measured page lengths, the position of a mid-alphabet name and the click
target size. Criteria fixed before scoring: C1 resembles the website card, C2 finds a person
fast, C3 obvious that a card opens the entry, C4 calm. Noise is the gap between the two Claude
runs of one persona in round 1.

Round 1, four candidates (overall per run: practitioner Claude, Claude, Codex / CTO Claude,
Claude, Codex):

| Option         | practitioner | CTO   | Mean | C1   | C2   | C3   | C4   |
| -------------- | ------------ | ----- | ---- | ---- | ---- | ---- | ---- |
| filter-grid    | 9/8/9        | 8/8/9 | 8.5  | 8.67 | 9.17 | 7.67 | 8.33 |
| website-order  | 7/7/7        | 7/7/8 | 7.17 | 8.83 | 5.5  | 7.67 | 8.67 |
| rows           | 6/6/7        | 6/6/6 | 6.17 | 3.83 | 6.83 | 7.5  | 6.83 |
| full-bio-cards | 2/2/3        | 2/2/3 | 2.33 | 4.17 | 1.33 | 2.67 | 4.67 |

All six reviewers named the same cause holding C3 down: nothing on the card itself showed that it
opens. Fixed: an arrow after the name, moving on hover, and the phone's filter segments sized to
their labels. Round 2, the fixed page against the earlier overview (Claude, Codex per persona):

| Option         | practitioner | CTO | Mean | C1   | C2  | C3  | C4   |
| -------------- | ------------ | --- | ---- | ---- | --- | --- | ---- |
| filter-grid    | 9/9          | 8/9 | 8.75 | 8.75 | 9.0 | 8.5 | 8.0  |
| full-bio-cards | 3/4          | 3/4 | 3.5  | 4.75 | 2.0 | 3.0 | 5.75 |

No reviewer named a must-fix, so the review stopped. Left as it is: every reviewer misses the
website's one-line description under the role. The website's team page does not publish it in its
JSON-LD, so this repo cannot show it without copying the website's data; the website brief in the
run report asks for it. On a phone the hover cue is absent and the arrow carries the cue alone.
