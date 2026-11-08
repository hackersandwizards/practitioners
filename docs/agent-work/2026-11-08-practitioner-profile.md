# A practitioner profile for matching

Each entry can now carry an optional profile beside bio and links: what the person trains on, how,
for whom, in which languages, with which stack and AI tools at which depth, in which industries
and roles, since when, and their public work. `src/lib/schema.ts` holds the fields and their fixed
lists; `src/components/Profile.astro` renders them under the bios; `CONTRIBUTING.md` and the
`practitioner-bio` skill ask for them. No entry fills them yet: each person adds their own.

## Research, fetched 08.11.2026

| Attribute                            | Who uses it                                                                                                                                                                      | Captured as                                                                                                                                                          | How it serves matching                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Skills and technologies              | Toptal, Cinode, freelancermap, O\*NET, Stack Overflow survey                                                                                                                     | Tags. freelancermap dropped its free-text field because only the skills area feeds matching. O\*NET lists technology skills per occupation, marked hot and in demand | Filter and rank against the request's stack                                       |
| Technology categories                | Stack Overflow survey 2025                                                                                                                                                       | Languages, databases, cloud, web frameworks, IDEs, LLMs, collaboration tools                                                                                         | Keeps one list readable; not needed as a field                                    |
| Proficiency                          | SFIA (7 levels of responsibility, Follow to Set strategy), MuchSkills (1 to 9, delivery from 4), Birdview (beginner to expert, one scale everywhere), Dreyfus (5 stages), Cinode | Level scales, mostly self-assessed, MuchSkills with manager validation at project close                                                                              | Rules out the inexperienced; reliable only where levels are anchored or validated |
| AI tool fluency                      | AI Coding Fluency model (phodal)                                                                                                                                                 | 5 stages from Awareness to Agent-First                                                                                                                               | Separates assistant users from people who run agents                              |
| Languages                            | MuchSkills (languages plus markets), CEFR                                                                                                                                        | Language with CEFR A1 to C2                                                                                                                                          | Hard filter on the training's language                                            |
| Industries                           | MuchSkills, Birdview                                                                                                                                                             | Tagged sector experience                                                                                                                                             | Weights domain fit                                                                |
| Roles and seniority                  | Birdview, Toptal                                                                                                                                                                 | Role and level; Toptal shows years of experience and a "previously at" employer                                                                                      | Credibility with the room                                                         |
| Certifications                       | MuchSkills, Birdview, freelancermap                                                                                                                                              | Name with date or expiry                                                                                                                                             | Compliance filters                                                                |
| Project history and public work      | Birdview, freelancermap                                                                                                                                                          | Entries with client or industry, duration, outcome                                                                                                                   | Evidence behind a claimed skill                                                   |
| Availability, travel, rate           | MuchSkills, Cinode, Birdview (availability); freelancermap (travel in matching, rate); Malt (rate)                                                                               | Utilisation data, flags, numbers                                                                                                                                     | Hard filters; private here                                                        |
| Formats, group size, course language | Trainer marketplaces and trainer profiles                                                                                                                                        | Delivery mode, session length, course languages, topics (search results only; no shared standard found)                                                              | Fit to the booked format and room                                                 |

Sources: [SFIA 9 levels](https://sfia-online.org/en/sfia-9/responsibilities),
[MuchSkills consulting skills matrix](https://www.muchskills.com/blog/consulting-skills-matrix),
[Birdview skills-based staffing](https://birdviewpsa.com/blog/skills-based-staffing-service-teams/),
[Cinode role matching](https://support.cinode.com/en/articles/91561-how-do-i-work-with-skills-matching-a-role),
[freelancermap relaunch](https://www.freelancermap.de/blog/?p=57985),
[freelancermap profile guide](https://www.freelancermap.com/blog/freelance-profile-tips-examples/),
[Toptal developer profiles](https://www.toptal.com/hire-software-developers),
[Stack Overflow survey 2025, technology](https://survey.stackoverflow.co/2025/technology),
[O\*NET hot and in-demand technologies](https://www.onetcenter.org/reports/Hot_Technologies_Demand.html),
[ESCO skills pillar](https://esco.ec.europa.eu/en/classification/skill_main),
[AI Coding Fluency](https://phodal.github.io/ai-coding-fluency/docs/overview),
[CEFR](https://en.wikipedia.org/wiki/Common_European_Framework_of_Reference_for_Languages),
[Dreyfus model](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition). Malt's help
pages answered 403; its fields come from search results only.

## What the design takes from it

- Every field that matching compares takes values from a fixed list, as freelancermap's relaunch
  argues: a free-text value matches nothing.
- Depth replaces a self-rating: `used`, `shipped`, `leads` name what the person did, each step
  including the one before, and `teaches` is a flag of its own. Self-rated 1 to 5 scales were the
  variant reviewers trusted least.
- Languages take CEFR levels plus whether the person trains in the language, the hard filter for a
  German or English training.
- Availability, travel, rate, home town and contact data stay out of this public repository.

## Blind review

Medium: three personas (a COO staffing a client training, a client's engineering lead accepting a
proposed trainer, a trainer filling in the profile), Claude and Codex, one run each, structures
under neutral letters in a shuffled order per reviewer, with the same typical client request.
Criteria fixed before scoring: C1 enough to match, C2 effort to fill in, C3 clarity, C4 nothing
confidential, each 0 to 10.

| Round | Structure                                                                         | C1   | C2   | C3   | C4   | Mean |
| ----- | --------------------------------------------------------------------------------- | ---- | ---- | ---- | ---- | ---- |
| 1     | Fixed lists, depth by what was done (K)                                           | 8.83 | 6.33 | 7.5  | 9.67 | 8.08 |
| 1     | Today: bio and links (W)                                                          | 2.5  | 8.5  | 8.0  | 8.17 | 6.79 |
| 1     | Free tags and top skills (P)                                                      | 5.0  | 7.83 | 4.67 | 9.0  | 6.63 |
| 1     | Self-rated 1 to 5 with years (R)                                                  | 6.67 | 3.83 | 4.83 | 8.83 | 6.04 |
| 2     | K revised: `teaches` as a flag, `room_levels` with `mixed`, NDA line (M, shipped) | 8.33 | 6.33 | 8.0  | 9.5  | 8.04 |
| 2     | K unchanged                                                                       | 7.5  | 6.17 | 6.17 | 8.33 | 7.04 |
| 2     | Today (W)                                                                         | 2.83 | 8.67 | 8.33 | 7.67 | 6.88 |

All six reviewers chose K in round 1 and M in round 2. Today's structure scored 6.79 and 6.88 in
the two rounds, a spread of 0.09; K fell from 8.08 to 7.04 once M stood beside it, so a score here
is relative to its round. Round 1's reasons below the maximum that M fixed: depth steps that were
not one scale (all six), `levels` read as the trainer's own level (three), no value for a mixed
room (four), an industry that points to an NDA client (three).

Left as they are, named in round 2: the field count (C2 stays at 6.33; the interview and a reply
by mail carry most of it), overlap between `agentic-coding`, `agent-orchestration` and
`spec-driven-development`, no field for outcomes a past team reached, and `trains: true` beside a
B1 level.

One reviewer prompt, verbatim apart from the file paths:

> You are the COO of a small training company for AI-assisted software engineering. A client has
> bought a training; you pick which of about 50 freelance trainers delivers it, often within a day,
> from their profiles. Medium: a YAML block in a Markdown file in a public GitHub repository,
> edited in the GitHub browser editor or with an AI assistant, rendered as a profile web page read
> on a laptop at 1440 px. Audience: the person you are, as described. Read these files:
> request.md (a typical client request) and the profile structures: […] Each structure file has
> its own letter. Judge each structure as the person you are. Criteria, each 0 to 10: C1 Enough to
> match […] C2 Effort to fill in […] C3 Clarity […] C4 Nothing confidential […]

## Examples

`catalog/stories/People/Profile.stories.ts` fills the profiles of Christian Tietze and Stefan
Munz from their own bios only and leaves the rest empty, as stories in the catalog. Their entries
stay unchanged until each of them adds a profile.
