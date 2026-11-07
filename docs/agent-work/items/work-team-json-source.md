---
kind: work
status: open
priority: 3
owner: Ada
evidence: "website 4028ca4b..d987f3d1 (07.11.) publish /team.json; not yet deployed, the website deploys at the 06:00 schedule."
---

# Read the team roster from the website's /team.json

Once `https://www.hackersandwizards.dev/team.json` answers on the live site, change
`src/lib/website.ts` to fetch it instead of parsing `/team/`'s HTML, match by `slug` against the
folder name rather than by name, show `role` and, where not `null`, `description` under it, link
`url`, and add a check to this repo's gate that fails when a `slug` has no folder.
