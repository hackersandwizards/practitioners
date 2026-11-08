import type { SchemaContext } from "astro:content";
import { z } from "zod";

/** https only: a link renders as an href, and z.url() alone also takes javascript: URLs. */
const link = z.url({ protocol: /^https$/ });

/** A controlled list: matching compares keys, the page shows the labels. A value missing here is
 *  added to the list by pull request, never written as free text. */
const vocab = <K extends string>(labels: Record<K, string>) =>
  z.enum(Object.keys(labels) as [K, ...K[]]);

/** How deep a practitioner works with a technology or an AI tool, each step something they did
 *  and each including the one before, so the answer needs no self-rating. Teaching it is a flag of
 *  its own, since teaching implies no production work. */
export const depths = {
  used: "Used at work",
  shipped: "Shipped with it",
  leads: "Set it up for a team",
};

/** What a training is about, independent of which h&w training it is sold as. */
export const topics = {
  "agentic-coding": "Agentic coding",
  "context-engineering": "Context engineering",
  "spec-driven-development": "Spec-driven development",
  "agent-orchestration": "Agent orchestration",
  "testing-and-quality": "Testing and code quality with AI",
  "legacy-modernisation": "Legacy modernisation",
  "software-architecture": "Software architecture",
  "platform-engineering": "Platform engineering and DevOps",
  security: "Security",
  "llm-applications": "Building LLM applications",
  evals: "Evals",
  "data-and-ml": "Data and machine learning",
  "ai-product-management": "Product management with AI",
  "design-with-ai": "Design with AI",
  "engineering-leadership": "Leading teams through AI adoption",
  "ai-strategy": "AI strategy for organisations",
};

export const formats = {
  training: "Training of one day or more",
  workshop: "Workshop",
  talk: "Talk or keynote",
  coaching: "Coaching or mentoring",
  hackathon: "Hackathon",
  assessment: "Team assessment",
};

export const deliveries = { onsite: "On site", remote: "Remote" };

/** Who sits in the room. */
export const audiences = {
  developers: "Developers",
  qa: "QA and testers",
  product: "Product managers and owners",
  design: "Designers",
  data: "Data scientists and ML engineers",
  leads: "Engineering leads",
  executives: "Executives",
  business: "Non-technical teams",
};

/** How far the rooms they have trained already were with AI; not the trainer's own level. */
export const roomLevels = {
  starting: "Starting out",
  using: "Using assistants",
  agentic: "Working with agents daily",
  mixed: "All three in one room",
};

export const domains = {
  automotive: "Automotive",
  finance: "Banking and finance",
  insurance: "Insurance",
  commerce: "E-commerce and retail",
  energy: "Energy and utilities",
  health: "Healthcare and pharma",
  logistics: "Logistics and mobility",
  manufacturing: "Manufacturing",
  media: "Media and publishing",
  public: "Public sector",
  telecom: "Telecommunications",
  travel: "Travel and hospitality",
  software: "Software and SaaS",
  education: "Education",
};

export const roles = {
  engineer: "Software engineer",
  architect: "Architect",
  "tech-lead": "Tech lead",
  "engineering-manager": "Engineering manager",
  "tech-executive": "CTO or CIO",
  "product-manager": "Product manager or owner",
  designer: "Designer",
  "data-scientist": "Data scientist or ML engineer",
  platform: "DevOps or platform engineer",
  qa: "QA engineer",
  "agile-coach": "Agile coach",
  founder: "Founder",
  consultant: "Consultant",
};

export const languageLevels = {
  native: "native",
  c2: "C2",
  c1: "C1",
  b2: "B2",
  b1: "B1",
};

export const kinds = {
  book: "Book",
  product: "Product",
  talk: "Talk",
  article: "Article",
  podcast: "Podcast",
  course: "Course",
  "open-source": "Open source",
  community: "Community",
};

/** The affiliations that name no other company, with their labels. */
export const ownAffiliations = { "hackers&wizards": "hackers&wizards", freelance: "Freelance" };

const year = z.int().min(1960).max(new Date().getFullYear());

/** A technology or tool as its maker spells it ("TypeScript", "Claude Code"), so the same name
 *  in two entries matches. */
const skill = z.object({
  name: z.string().min(1).max(40),
  depth: vocab(depths),
  teaches: z.boolean().optional(),
});

/** What a practitioner owns about themselves. Who is shown on hackersandwizards.dev, in which
 *  group and with which role, is the website's roster and not a field here. */
export const practitionerSchema = ({ image }: SchemaContext) =>
  z
    .object({
      name: z.string(),
      /** Square portrait next to the bio; photo-size.test.ts holds its minimum size. Mandatory like
       *  the bio (entry.ts, `missing`); a seed h&w starts without one shows initials instead. */
      photo: image().optional(),
      /** Who the practitioner works for: a key of `ownAffiliations`, or the organisation's name as
       *  it writes it ("INNOQ", "re:cinq"), so two people at one company match. Part of matching a
       *  trainer to a client or project; empty where nobody has stated it. */
      affiliation: z.string().min(1).max(60).optional(),
      /** Mandatory for every human; the practitioner-bio skill enforces it. Optional here only
       *  because Reachy, the familiar, has a Hugging Face page instead. */
      linkedin: link.optional(),
      bluesky: link.optional(),
      x: link.optional(),
      threads: link.optional(),
      mastodon: link.optional(),
      github: link.optional(),
      website: link.optional(),
      /** A public booking link (cal.com, Calendly), for "book a call with me". */
      bookme: link.optional(),
      /** Further public profiles the person keeps (GitLab, Xing, Speaker Deck, Wikidata), labelled
       *  by host; the website lists them with the named links in its structured data. */
      profiles: z.array(link).optional(),
      /** The profile h&w matches a client's training against. Public like the bio: no rate,
       *  availability, client under NDA or contact detail, which Company OS keeps. */
      topics: z.array(vocab(topics)).optional(),
      formats: z.array(vocab(formats)).optional(),
      delivery: z.array(vocab(deliveries)).optional(),
      audiences: z.array(vocab(audiences)).optional(),
      room_levels: z.array(vocab(roomLevels)).optional(),
      /** The largest group they have trained alone. */
      group_max: z.int().positive().optional(),
      /** ISO 639-1 code, CEFR level, and whether they run a training in it. */
      languages: z
        .array(
          z.object({
            code: z
              .string()
              .regex(/^[a-z]{2}$/)
              .refine((c) => new Intl.DisplayNames(["en"], { type: "language" }).of(c) !== c),
            level: vocab(languageLevels),
            trains: z.boolean().optional(),
          }),
        )
        .optional(),
      stack: z.array(skill).optional(),
      ai_tools: z.array(skill).optional(),
      domains: z.array(vocab(domains)).optional(),
      roles: z.array(vocab(roles)).optional(),
      /** The year of their first professional job in software or product. */
      since: year.optional(),
      certifications: z
        .array(
          z.object({
            name: z.string().min(1),
            year: year.optional(),
            url: link.optional(),
          }),
        )
        .optional(),
      /** Public work only: what anyone can find. */
      public_work: z
        .array(
          z.object({
            kind: vocab(kinds),
            title: z.string().min(1),
            year: year.optional(),
            url: link.optional(),
          }),
        )
        .optional(),
      /** draft until `missing` in entry.ts finds nothing and the person's own change or yes is in. */
      status: z.enum(["draft", "active"]).default("draft"),
      owner: z.string().optional(),
      updated: z.iso.date().optional(),
    })
    // A seed may wait for its portrait; an entry the person approved may not.
    .refine((d) => d.status === "draft" || d.photo, { message: "an active entry needs a photo" });
