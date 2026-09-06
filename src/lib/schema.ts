import type { SchemaContext } from "astro:content";
import { z } from "zod";

/** What a practitioner owns about themselves. Who is shown on hackersandwizards.dev, in which
 *  group and with which role, is the website's roster and not a field here. */
export const practitionerSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string(),
    /** Square portrait next to the bio, 480x480 like the ones the website serves. */
    photo: image(),
    /** Mandatory for every human; the practitioner-bio skill enforces it. Optional here only
     *  because Reachy, the familiar, has a Hugging Face page instead. */
    linkedin: z.url().optional(),
    bluesky: z.url().optional(),
    x: z.url().optional(),
    threads: z.url().optional(),
    mastodon: z.url().optional(),
    github: z.url().optional(),
    website: z.url().optional(),
    /** A public booking link (cal.com, Calendly), for "book a call with me". */
    bookme: z.url().optional(),
    /** draft until name, bio, LinkedIn and portrait are all real. */
    status: z.enum(["draft", "active"]).default("draft"),
    owner: z.string().optional(),
    updated: z.iso.date().optional(),
  });
