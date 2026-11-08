// entry.json in each practitioner's folder, the package's data for sites that render practitioner
// pages without astro (the website's profiles load in plain Node): the entry's frontmatter as the
// schema parses it, its bios as Markdown with one line per paragraph, and its portrait as the
// package export subpath. One file per folder, so a protected name stays inside its own folder.
// `bun run export` writes them; src/lib/export.test.ts fails while one is stale.
import type { SchemaContext } from "astro:content";
import { join } from "node:path";
import { Glob } from "bun";
import { z } from "zod";
import { practitionerSchema, type EntryJson } from "../src/lib/schema";

export const base = join(import.meta.dir, "../src/content/practitioners");

// The photo field holds a path; the website resolves it, so the schema checks a string here.
export const schema = practitionerSchema({ image: () => z.string() } as unknown as SchemaContext);

const split = (text: string) => {
  const lf = text.replace(/\r\n/g, "\n");
  const [, frontmatter, body] = lf.match(/^(?:---\n([\s\S]*?)\n---(?:\n|$))?([\s\S]*)$/)!;
  return { data: (frontmatter ? Bun.YAML.parse(frontmatter) : {}) as { photo?: string }, body };
};

/** Paragraphs joined by a blank line, each on one line: the files wrap at 100 columns. */
const paragraphs = (body: string) =>
  body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " "))
    .join("\n\n");

/** Each folder's entry.json path and the text it must hold. */
export async function generate() {
  const files = new Map<string, string>();
  for (const bio of new Glob("*/bio.md").scanSync(base)) {
    const slug = bio.split("/")[0]!;
    const { data, body } = split(await Bun.file(`${base}/${bio}`).text());
    const de = Bun.file(`${base}/${slug}/bio.de.md`);
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new Error(`${slug}: ${z.prettifyError(parsed.error)}`);
    // The schema typed photo as an image; the file holds the path next to bio.md.
    const { photo: _, ...rest } = parsed.data;
    const entry = {
      slug,
      ...rest,
      ...(data.photo && { photo: `practitioners/${slug}/${data.photo.replace(/^\.\//, "")}` }),
      bio: {
        en: paragraphs(body),
        de: (await de.exists()) ? paragraphs(split(await de.text()).body) : "",
      },
    } as EntryJson;
    files.set(`${base}/${slug}/entry.json`, `${JSON.stringify(entry, null, 2)}\n`);
  }
  return files;
}

if (import.meta.main) for (const [path, text] of await generate()) await Bun.write(path, text);
