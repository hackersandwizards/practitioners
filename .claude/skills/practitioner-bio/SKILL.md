---
name: practitioner-bio
description: >-
  Complete a practitioner's English and German bio, portrait and profile links in the
  practitioners collection, by mail or by interview, shown at / and rendered on
  hackersandwizards.dev. Use for "create my bio", "practitioner bio", "my bio", "Biografie
  erstellen", "hilf mir eine Biografie zu erstellen", "add my profile links", "update my bio", "ask
  the trainers to complete their profiles", "Profil vervollständigen", and for a trainer's reply to
  such a mail.
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
before their yes.

Not here at all: role and group. Who appears on the website, in which section and with which
title is the website's roster, kept by Stefan and Bina. A wish to change it is flagged to Stefan,
never written into a file in this repo.

## Two routes

- **By mail**, the default: an h&w colleague asks the person by mail, and the person needs no
  access to this repo and sees no other entry.
- **Interview**: the person, or a colleague with them on a call, says "create my bio" here.

## By mail

1. **Request.** Load the Company OS `email` skill before the first mail call. Draft one mail per
   person, in their language, never sent by you: a founder checks and sends it. It shows only this
   person's entry: the English and German text the website publishes for them
   on `hackersandwizards.dev/team/<slug>/`, with that link, else the text here; the portrait
   attached; their links and the proposed ones; what the mandatory list still lacks, as the
   entry's page at `/<slug>/` in `bun run dev` lists it. Never a link to
   this repo or its pages, which show every other entry. It asks for one reply: it fits as
   it is, corrections or a new photo, or take me off. Check: the draft shows no other person's
   entry.
2. **"It fits".** Save exactly the text they confirmed, set `owner` to their name, `updated`, and
   `status: active` once the mandatory list is complete. One mail
   round, no confirmation mail. Commit as in step 9 below.
3. **Corrections.** Apply them under the style rules of step 5 below, then draft a reply in the
   same thread with the whole updated entry and ask for a yes. Their yes is step 2.
4. **"Take me off".** Delete their directory, commit, and flag it to Stefan for the website roster.

## Interview

1. **Ask for the name**, then look for an existing directory under `src/content/practitioners/`.
   Without write access to this repo, take the mail route instead.
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
8. **Save** both files in the format below with `status: draft`, then run `bun run dev` and show the result at
   http://localhost:4325/<slug>/ so they see their page as a client will. Confirm the new sentences are on the
   page, not that the page loaded.
9. **Ask for their yes** to the page. Set `status: active` only now. **Commit only after they say
   yes** to exactly what the commit contains. Name the three files on `git commit` itself; never `git add -A`. Then push to main.

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
status: active # draft until every mandatory field is real and they said yes
owner: <Full Name>
updated: "2026-09-06" # quoted, or YAML makes it a Date and the schema rejects it
---

<The English bio.>
```

`bio.de.md` holds the German text and nothing else.

## Boundaries

- Name no client without public coverage of the work; describe the work instead.
- Role and group are the website's roster. Flag a wish, do not write it here.
