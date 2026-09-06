import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";
import { practitionerSchema } from "./lib/schema";

// The directory is the practitioner's identity; the filename carries none.
const dir = ({ entry }: { entry: string }) => entry.slice(0, entry.indexOf("/"));
const base = "./src/content/practitioners";

const practitioners = defineCollection({
  loader: glob({ pattern: "*/bio.md", base, generateId: dir }),
  schema: practitionerSchema,
});

/** The German bio of the same person. The frontmatter lives on bio.md alone. */
const practitionersDe = defineCollection({
  loader: glob({ pattern: "*/bio.de.md", base, generateId: dir }),
  schema: z.object({}),
});

export const collections = { practitioners, practitionersDe };
