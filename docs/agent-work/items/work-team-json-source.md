---
kind: work
status: open
priority: 3
order: 50
owner: Ada
evidence: "website 4028ca4b..d987f3d1 (07.11.) publish /team.json; on 07.11. 19:57 the live URL still answered 404. The website ships only with its daily 06:00 schedule or a manual `pages` job, so the earliest is 08.11. 06:00."
---

# Read the team roster from the website's /team.json

Once `https://www.hackersandwizards.dev/team.json` answers on the live site, change
`src/lib/website.ts` to fetch it instead of parsing `/team/`'s HTML, match by `slug` against the
folder name rather than by name, show `role` and, where not `null`, `description` under it, link
`url`, and add a check to this repo's gate that fails when a `slug` has no folder.

The website's `src/pages/team.json.ts` (origin/main e370f70b) returns an array of
`{ slug, name, role, description, url, image }`, with `description` `null` where the card has no
credential line. Switch only after the live URL answers 200: until then a fetch of it leaves the
overview without a roster, and a gate check against it would fail every commit here.
