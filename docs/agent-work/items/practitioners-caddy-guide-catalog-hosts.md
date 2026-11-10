---
kind: work
status: open
priority: 3
order: 2050
evidence: "Each repo's bun run dev serves its catalog on these ports since 01.11. (brand 63be655, slides 67240fe, documents 58f3587); practitioners origin/main README, read 08.11., lists os, website, trainer-hub, talks and practitioners only. Caddy is not installed on Benedikt's Mac, so the .localhost addresses without a port answer nothing there yet."
owner: Agent (practitioners session)
area: software-engineering
---

# Add brand, slides and documents to the Caddy guide in the practitioners README

Add brand, slides and documents (ports 4326 to 4328) to the Caddy guide in the README.

`brand.localhost`, `slides.localhost` and `documents.localhost` go into the table and the Caddyfile block as `reverse_proxy` entries like os.localhost (Benedikt decided local addresses for every catalog on 01.11.; os's own entry is e54c08d30). Done when the README's table and Caddyfile block name all three.
