---
name: practitioner-bio
description: >-
  Complete a practitioner's English and German bio, portrait and profile links in the
  practitioners collection, by their own pull request, a mail request or an interview, shown at /
  and rendered on hackersandwizards.dev. Use for "create my bio", "practitioner bio", "my bio",
  "Biografie erstellen", "hilf mir eine Biografie zu erstellen", "add my profile links", "update my
  bio", "ask the trainers to complete their profiles", "Profil vervollständigen", "review this pull
  request", and for a trainer's reply to such a mail.
---

# Practitioner Bio

You complete a practitioner's introduction and save it to `src/content/practitioners/<slug>/`:
`bio.md` (the frontmatter and the English text), `bio.de.md` (the German text, no frontmatter)
and `photo.webp`. The website renders the English page from the first file and the German page
from the second, so what you save is what a client reads.

## Mandatory and optional

Mandatory: **name, bio in English and German, LinkedIn URL, portrait**. Without all of them the
entry stays `status: draft` and you say what is missing.

Optional, asked once each, recorded only where the practitioner maintains it (a dead link is worse
than none): **Bluesky, X, Threads, Mastodon, GitHub, own website or blog, a public booking link**
(cal.com, Calendly; `bookme` in the schema), and any further public profile the person keeps
(GitLab, Xing, Speaker Deck, Wikidata; `profiles`). A link the person already publishes, on their
own site or their website profile, goes into the request as a proposal, never into the entry
before their own change or yes.

Optional, the **profile** h&w matches a client's training against: what they train on, formats,
on site or remote, audiences, the rooms they have trained, the largest group, languages, stack and
AI tools with depth, industries, roles held, the year they started, certifications and public work.
`practitionerSchema` holds every field and the fixed list of values each takes. A value the person
names that no list holds goes into the pull request or the reply as a wish for the list, never into
the entry as free text. Depth is something the person did, each step including the one before:
`used` at work, `shipped` production work with it, `leads` (set it up for a team and chose its
conventions); `teaches: true` on top where they have taught it to a team. An industry goes in only
where naming it points to no single client under NDA.

Not here at all: role and group. Who appears on the website, in which section and with which
title is the website's roster, kept by Stefan and Bina. A wish to change it is flagged to Stefan,
never written into a file in this repo.

## Routes

The person's own change is their yes: a pull request or commit they made to their folder publishes
the entry as it stands after that change. An h&w colleague edits an entry only from the person's
own words, and commits it only after their yes to exactly that text, and after
`bun run check-confidential --staged` passes: the hook runs no confidential scan on a bio-only
commit.

- **Their pull request**, the default. `CONTRIBUTING.md` tells the person how, in the browser or
  with Claude Code.
- **Request.** An h&w colleague asks the person by mail to look at their page and improve their
  entry here.
- **Interview**: the person, or a colleague with them on a call, says "create my bio" here.

## Their pull request

1. Check the author: the GitHub account is the person's, shown by a profile they keep that links
   it (their website, LinkedIn) or by their mail from the address h&w holds for them, and the
   change touches only their folder. Otherwise comment and merge nothing.
2. `gh pr checkout <number>`, then `bun run check`. A confidential term other than the person's
   own name is a review comment and blocks the merge. Their own name gets one `scaffolding.allow`
   entry in `package.json` per path, with the name as `text` (matching ignores case; a list holds
   other spellings) and their folder as `src/content/practitioners/<slug>/**`, pushed to the pull request's branch
   before the merge, so `main` never holds the name without its entry. Style findings under step 6
   below go into a review comment; their wording stays theirs.
3. Merge. Then on `main`: an uploaded portrait under another name or format becomes a 480x480
   `photo.webp`, the upload removed, and a seed without `photo:` gets `photo: ./photo.webp`; set `owner` to their name, `updated`, and `status: active`
   once the mandatory list is complete; commit with the paths named and push. A value they wished
   for a profile list: add it with its label to the list in `src/lib/schema.ts` and to their entry,
   in the same commit, unless an existing value already means it; then tell them which.
4. Asked for a German text, draft it from their English as in step 8 below, show it in the pull
   request or by mail, and commit it after their yes.

## Request

Load the Company OS `email` skill before the first mail call. Draft one mail per person who still
has something to do, in their language, never sent by you: a founder checks and sends it. A founder
gets none, nor does a person whose complete `active` entry they committed themselves. The mail does
one thing: it opens with the ask as a question, links their page on
`hackersandwizards.dev/team/<slug>/` where one exists, lists only what the mandatory list still
lacks, as the entry's page at `/<slug>/` in `bun run dev` lists it, and the proposed links, one
bullet each where there are two or more, then one sentence asking for the profile with the link to
its section in `CONTRIBUTING.md` (`#your-profile-for-matching`), then their folder on GitHub,
`CONTRIBUTING.md` and one line offering the reply by mail, where a list of answers is enough and
h&w writes the fields. About 100 words without the links. A person whose entry lacks only the
profile gets the mail too. A reply with text instead of a pull request
is a correction: apply it under the style rules of step 6 below, draft a reply in the thread with
the whole updated entry, and commit after their yes. A reply confirming the entry as it stands is
their yes: set `owner`, `updated` and `status` as in step 3 above and commit. "Take me off":
delete their directory, commit, and flag it to Stefan for the website roster.

## Interview

1. **Ask for the name**, then look for an existing directory under `src/content/practitioners/`.
   What is already there is not asked again; an existing entry is updated, not recreated. Keep
   frontmatter you did not collect.
2. **Collect the links**, mandatory and optional as above.
3. **Ask for the portrait**: a file path to a photo they like, roughly square, at least 480x480.
   Convert it to a 480x480 `photo.webp` in their directory.
4. **Interview for substance**, a few questions rather than a form: what they work on right now,
   the two or three stations or projects that shaped them, what they deliver with h&w, and one
   concrete thing that makes them memorable (a niche, a stack, a first).
5. **Fill the profile** from those answers first, then ask only for the fields still empty, grouped
   as the person thinks of them: what and how they train (topics, formats, delivery, audiences,
   room levels, largest group, languages they train in), what they work with (stack and AI tools,
   each with its depth and whether they teach it), where they come from (industries, roles, the
   year they started, certifications, public work). Offer the list's values rather than reading
   out the schema. Unknown stays empty.
6. **Draft the English bio**: 3 to 5 sentences, 100 to 2000 characters, third person. Short
   sentences, concrete nouns, real experience over adjectives. No buzzwords ("passionate",
   "expert", "seasoned", "transform"), no technology lists for their own sake, no dash used as
   punctuation. It should read like a colleague describing them, not like a CV.
7. **Show the draft and iterate.** Their reaction is the test; expect a round or two.
8. **Draft the German bio** from the approved English one: the same content in their own German,
   not a word-by-word translation. Show it; most practitioners will edit a phrase.
9. **Save** both files in the format below with `status: draft`, then run `bun run dev` and show
   the result at http://localhost:4325/<slug>/ so they see their page as a client will. Confirm the
   new sentences are on the page, not that the page loaded.
10. **Commit**, the changed files named on `git commit`. Run by the person in their fork (`origin`
   is not `hackersandwizards/practitioners`): commit on a branch named after the slug, push it to
   their fork and open the pull request with `gh pr create`, which is their yes and their only way
   in. Run by an h&w colleague with them: commit on `main` only after their yes to exactly what the
   commit contains, and push.

## File format

`practitionerSchema` in `src/lib/schema.ts` is the authority; the shape today:

```markdown
---
name: <Full Name>
photo: ./photo.webp # absent on a seed until the portrait arrives
affiliation: freelance # or the company's name as it writes it; only as the person states it
linkedin: <url>
bluesky: <url> # optional fields only where a living profile exists
x: <url>
threads: <url>
mastodon: <url>
github: <url>
website: <url>
bookme: <url>
profiles: # further public profiles, labelled by host
  - <url>
topics: [agentic-coding, testing-and-quality] # the profile: keys from the lists in schema.ts
formats: [training, workshop]
delivery: [onsite, remote]
audiences: [developers, qa]
room_levels: [using, mixed]
group_max: 16
languages:
  - { code: de, level: native, trains: true }
stack:
  - { name: TypeScript, depth: shipped }
ai_tools:
  - { name: Claude Code, depth: leads, teaches: true }
domains: [insurance]
roles: [engineer, tech-lead]
since: 2008
certifications:
  - { name: <name>, year: 2024, url: <url> }
public_work:
  - { kind: talk, title: <title>, year: 2025, url: <url> }
status: active # draft until every mandatory field is real and their change or yes is in
owner: <Full Name>
updated: "2026-09-06" # quoted, or YAML makes it a Date and the schema rejects it
---

<The English bio.>
```

`bio.de.md` holds the German text and nothing else.

## Boundaries

- Name no client without public coverage of the work; describe the work instead. The same holds for
  an industry, a stack entry and public work in the profile.
- Rates, availability, travel, home town and contact data never go into this public repo: Company
  OS keeps them.
