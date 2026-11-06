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

Not here at all: role and group. Who appears on the website, in which section and with which
title is the website's roster, kept by Stefan and Bina. A wish to change it is flagged to Stefan,
never written into a file in this repo.

## Routes

The person's own change is their yes: a pull request or commit they made to their folder publishes
the entry as it stands after that change. An h&w colleague edits an entry only from the person's
own words, and commits it only after their yes to exactly that text.

- **Their pull request**, the default. `CONTRIBUTING.md` tells the person how, in the browser or
  with Claude Code.
- **Request.** An h&w colleague asks the person by mail to look at their page and improve their
  entry here.
- **Interview**: the person, or a colleague with them on a call, says "create my bio" here.

## Their pull request

1. Check the author: the GitHub account is the person's, shown by a profile they keep that links
   it (their website, LinkedIn) or by their mail from the address h&w holds for them, and the
   change touches only their folder. Otherwise comment and merge nothing.
2. `gh pr checkout <number>`, then `bun run typecheck`. Style findings under step 5 below go into
   a review comment; their wording stays theirs.
3. Merge. Then on `main`: an uploaded portrait under another name or format becomes a 480x480
   `photo.webp`, the upload removed; set `owner` to their name, `updated`, and `status: active`
   once the mandatory list is complete; commit with the paths named and push.
4. Asked for a German text, draft it from their English as in step 7 below, show it in the pull
   request or by mail, and commit it after their yes.

## Request

Load the Company OS `email` skill before the first mail call. Draft one mail per person, in their
language, never sent by you: a founder checks and sends it. It links their page on
`hackersandwizards.dev/team/<slug>/` where one exists, their folder on GitHub and
`CONTRIBUTING.md`, says what the mandatory list still lacks, as the entry's page at `/<slug>/` in
`bun run dev` lists it, and lists the proposed links. A reply with text instead of a pull request
is a correction: apply it under the style rules of step 5 below, draft a reply in the thread with
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
5. **Draft the English bio**: 3 to 5 sentences, 100 to 2000 characters, third person. Short
   sentences, concrete nouns, real experience over adjectives. No buzzwords ("passionate",
   "expert", "seasoned", "transform"), no technology lists for their own sake, no dash used as
   punctuation. It should read like a colleague describing them, not like a CV.
6. **Show the draft and iterate.** Their reaction is the test; expect a round or two.
7. **Draft the German bio** from the approved English one: the same content in their own German,
   not a word-by-word translation. Show it; most practitioners will edit a phrase.
8. **Save** both files in the format below with `status: draft`, then run `bun run dev` and show
   the result at http://localhost:4325/<slug>/ so they see their page as a client will. Confirm the
   new sentences are on the page, not that the page loaded.
9. **Commit**, the changed files named on `git commit`. Run by the person in their fork (`origin`
   is not `hackersandwizards/practitioners`): commit on a branch named after the slug, push it to
   their fork and open the pull request with `gh pr create`, which is their yes and their only way
   in. Run by an h&w colleague with them: commit on `main` only after their yes to exactly what the
   commit contains, and push.

## File format

`practitionerSchema` in `src/lib/schema.ts` is the authority; the shape today:

```markdown
---
name: <Full Name>
photo: ./photo.webp
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
status: active # draft until every mandatory field is real and their change or yes is in
owner: <Full Name>
updated: "2026-09-06" # quoted, or YAML makes it a Date and the schema rejects it
---

<The English bio.>
```

`bio.de.md` holds the German text and nothing else.

## Boundaries

- Name no client without public coverage of the work; describe the work instead.
- Role and group are the website's roster. Flag a wish, do not write it here.
