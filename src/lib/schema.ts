import type { SchemaContext } from "astro:content";
import { z } from "zod";

/** https only: a link renders as an href, and z.url() alone also takes javascript: URLs. */
const link = z.url({ protocol: /^https$/ });

/** What a practitioner owns about themselves. Who is shown on hackersandwizards.dev, in which
 *  group and with which role, is the website's roster and not a field here. */
export const practitionerSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    /** Square portrait next to the bio, 480x480 like the ones the website serves. */
    photo: image(),
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
    /** draft until `missing` in entry.ts finds nothing. */
    status: z.enum(["draft", "active"]).default("draft"),
    /** The day the person said yes to the consent statement in the practitioner-bio skill. */
    consent: z.iso.date().optional(),
    owner: z.string().optional(),
    updated: z.iso.date().optional(),
  });
