---
kind: work
status: open
priority: 3
order: 1800
owner: Ada
evidence: "website 4028ca4b..d987f3d1 publish /team.json; the live URL answers 200 (curl 08.11.), so the switch below is due."
---

# Read the team roster from the website's /team.json

Once `https://www.hackersandwizards.dev/team.json` answers on the live site, change
`src/lib/website.ts` to fetch it instead of parsing `/team/`'s HTML, match by `slug` against the
folder name rather than by name, show `role` and, where not `null`, `description` under it, link
`url`, and add a check to this repo's gate that fails when a `slug` has no folder.

The website's `src/pages/team.json.ts` (origin/main e370f70b) returns an array of
`{ slug, name, role, description, url, image }`, with `description` `null` where the card has no
credential line. The live URL answers since 08.11., so nothing holds this back.
