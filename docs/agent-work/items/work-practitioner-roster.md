---
kind: work
status: open
priority: 2
owner: Ada
area: people
evidence: "09.11., 21:50: 63 entries, 19 active, 44 draft; 12 entries with a yes from 09.11. (4 by pull request, 8 by mail reply). The mail round went out 09.11. 08:00. Names, mail addresses and thread ids live in os (docs/agent-work/2026-11-08-practitioner-roster.md and Ada's run reports), since this repo is public."
assumption: "affiliation comes only from the person's Company OS record: its company, freelance where the record says so, hackers&wizards for staff; Slack was not read"
order: 510
---

# Every person who delivers for h&w has an entry, with affiliation

Draft the follow-up for the other 49 people, each only once they answered their first mail.

Done on 08.11.: `affiliation` in the schema, shown as "Works for" on each page; the overview
groups people into hackers&wizards, At a company (sorted by company), Freelance and Not stated
yet. Seeds without a portrait show initials and list "Portrait" as missing. The affiliation is the
company record's name from `work.company` or `facets.trainer.supply_partner`; staff are those with
an employment record.

## Yes on record, 09.11.

Read on 09.11. at 21:50 from the merged pull requests and from replies to the round of 09.11.
08:00. Names, threads and each person's state live in os
(`docs/agent-work/2026-11-08-practitioner-roster.md`), since this repo is public.

- **12 entries with a yes**: 4 by their own pull request (#3 to #7), now `active`; 8 by a mail
  reply confirming the entry as it stands, `updated` set to that day.
- **3 draft entries waiting on the person**: one sent the whole entry by mail and gets it back
  for their yes before anything is committed; two said they will fill in their entry and have no
  pull request yet.
- **Without a yes so far**: 40 more draft entries, and 6 active entries without a yes read in this run.
  One active entry is a founder's own; `benedikt-stemmildt` stays `draft`.

## What remains

- **Follow-up for the other 49** (the round of 09.11. 08:00 asked for bio and links, not for the profile or
  affiliation): draft only after each person has answered their first mail, so nobody gets two
  asks at once.
- **One new entry has no draft**: the only address on record bounces since 19.10.
- **One new entry lacks LinkedIn**: none on record; the mail asks for it.
- **Three affiliations stay empty**: the company names are on os's confidential list, so each
  waits until the person states it and the name gets an allow entry with their yes.
- **Six `active` entries carry no affiliation yet** although Company OS records one: an approved
  entry changes only with the person's yes, so the follow-up asks them.
- **Two more questions for the follow-up**, the folder names handed to os on 10.11.: four draft
  entries whose bio names a home town are asked whether that line stays, and the entry held in
  `markdownAwaiting` (`scripts/export.ts`) is asked whether its emphasis asterisks may go, since the
  website prints them as typed, unless the website comes to render emphasis.

## Before any public host

A public build shows an entry only when it is `active`. Nothing is hosted today; before a host goes up:

- Each `active` entry that the person neither committed nor said yes to is confirmed by them or returns to `draft`.
- The build stops copying every portrait into `dist/_astro/`: the schema's `image()` processes each entry's photo whether its page renders or not.

The blind review of the overview (08.11.) is in os `docs/agent-work/2026-11-08-practitioner-roster.md`.
