# Improve your own entry

Your profile on [hackersandwizards.dev/team](https://www.hackersandwizards.dev/team/) comes from
your folder in this repository. You change it here yourself and send the change to h&w as a pull
request: a request for us to take it over. We check it and merge it. Change only your own folder.

Your entry needs five things: your name, your LinkedIn link, an English bio, a German bio and a
portrait. A profile for matching is optional and helps us offer you the right trainings
([Your profile for matching](#your-profile-for-matching)). You need a free GitHub account, nothing else. Using Claude Code? Skip to
[With Claude Code](#with-claude-code).

## In the browser

1. Open your folder from the mail, or find your name in
   [the list of folders](https://github.com/hackersandwizards/practitioners/tree/main/src/content/practitioners),
   and click `bio.md`.
2. Click the pencil icon. The first time, GitHub offers to fork the repository, which makes your own
   copy: accept.
3. Edit the text. The **Preview** tab shows how it reads.
4. Click **Commit changes**, then **Propose changes**. On the next page, keep the title GitHub
   suggests or write "Update my bio", add any note for us in the description box, and click
   **Create pull request**. Done: the page now shows your pull request.
5. For `bio.de.md`, open your folder from the mail link again and click the pencil the same way.
   GitHub reuses your copy. If your folder has no `bio.de.md` yet, choose **Add file**, then
   **Create new file**, and name it `bio.de.md`. For a new portrait, open your folder and choose
   **Add file**, then **Upload files**. Each file may open its own pull request.

## With Claude Code

With [Bun](https://bun.sh) and the [GitHub CLI](https://cli.github.com) installed:

```bash
gh repo fork hackersandwizards/practitioners --clone
cd practitioners
bun install
claude
```

Say "update my bio". Claude interviews you for a few minutes, drafts both bios and shows your page
as the website lays it out, at `http://localhost:4325/<your-folder>/` (such as `stefan-munz`). A
box under the portrait lists what is still missing. Then Claude opens the pull request.

## What goes in your folder

| File           | Holds                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `bio.md`       | Your name and links between the two `---` lines, then your English bio                               |
| `bio.de.md`    | Your German bio, nothing else                                                                        |
| `photo.webp`   | Your portrait                                                                                        |
| `bio.short.md` | Optional: your English bio in at most 300 characters, for conference forms. Not shown on the website |

Until all five things named above are there, your entry stays a draft. A text that says "Seed draft" is a placeholder h&w wrote: replace it. If you do
not write German, say so in the pull request, and we draft the German text for your yes.

**Links**, only for profiles you keep up, each starting with `https://`: `linkedin`, and optionally
`bluesky`, `x`, `threads`, `mastodon`, `github`, `website`, `bookme` (a public booking page such as
cal.com or Calendly) and `profiles`, a list of any further public profiles. Lines you do not
recognise, such as `photo`, `status`, `owner` and `updated`, stay as they are.

```yaml
name: Ada Example
linkedin: https://www.linkedin.com/in/ada-example/
github: https://github.com/ada-example
profiles:
  - https://speakerdeck.com/ada-example
```

**The bio:** three to five sentences about you in the third person, as a colleague would introduce
you: what you work on now, the roles or projects that shaped you, what you do with h&w. Name a
client only where the work is public.

**The portrait:** roughly square, at least 480 by 480 pixels. Upload it as a JPEG, PNG or WebP under
any name and leave `photo.webp` in place; we crop the new one and put it in its place.

## Your profile for matching

Under your bio, an optional profile tells us which client training fits you. We match trainers to
a client's language, format, room and stack from these fields, so each one you fill in brings you
work that suits you. Fill in what is true, leave the rest out. Each field takes values from a fixed
list in [`src/lib/schema.ts`](src/lib/schema.ts). Missing a value? Name it in the pull request and
we add it to the list.

```yaml
topics: [agentic-coding, testing-and-quality] # what you train on
formats: [training, workshop] # also talk, coaching, hackathon, assessment
delivery: [onsite, remote]
audiences: [developers, qa] # who sat in your rooms
room_levels: [using, mixed] # how far those rooms were with AI: starting, using, agentic, mixed
group_max: 16 # the largest group you trained alone
languages:
  - { code: de, level: native, trains: true } # CEFR level; trains: you run trainings in it
stack:
  - { name: TypeScript, depth: shipped }
ai_tools:
  - { name: Claude Code, depth: leads, teaches: true }
domains: [insurance] # industries you worked in
roles: [engineer, tech-lead] # roles you held
since: 2008 # the year of your first job in software or product
certifications:
  - { name: Certified Kubernetes Administrator, year: 2024 }
public_work: # books, products, talks, articles, podcasts, courses, open source, communities
  - { kind: talk, title: Agents in a legacy codebase, year: 2025, url: https://example.com }
```

**Depth** says what you did, so you rate nothing: `used` at work, `shipped` production work with
it, `leads` when you set it up for a team and chose its conventions. Each step includes the one
before. Add `teaches: true` where you have taught it to a team. Write each name as its maker spells
it, so "Claude Code" in two profiles matches.

**Public only.** This repository is public. Rates, availability, travel plans, your home town and
contact details stay out: we keep them in our own records. Leave out an industry or a technology
that would point to a single client under NDA.

## After your pull request

By opening the pull request you agree that we publish your entry as it stands after your change.
GitHub mails you when we comment or merge. We check that the pull request comes from you and
touches only your folder. On style we comment and leave the wording to you. After the merge, h&w
copies your text to your page on `hackersandwizards.dev/team/<your-folder>/`, a separate step.

Your role and the group you appear in are kept on the website, not here: mention a wish in the pull
request. To be taken off, reply to the mail from h&w.
