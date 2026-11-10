// entry.json in each practitioner's folder, the package's data for sites that render practitioner
// pages without astro (the website's profiles load in plain Node): the entry's frontmatter as the
// schema parses it, its bios with one line per paragraph, and its portrait as the
// package export subpath. One file per folder, so a protected name stays inside its own folder.
// `bun run export` writes them; src/lib/export.test.ts fails while one is stale.
import type { SchemaContext } from "astro:content";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";
import { markdownToMdast } from "satteri";
import { z } from "zod";
import { missing } from "../src/lib/entry";
import { practitionerSchema, type EntryJson } from "../src/lib/schema";

export const base = join(import.meta.dir, "../src/content/practitioners");

// The photo field holds a path; the website resolves it, so the schema checks a string here.
export const schema = practitionerSchema({ image: () => z.string() } as unknown as SchemaContext);

export const split = (text: string) => {
  const lf = text.replace(/\r\n/g, "\n");
  const [, frontmatter, body] = lf.match(/^(?:---\n([\s\S]*?)\n?---(?:\n|$))?([\s\S]*)$/)!;
  return { data: (frontmatter ? Bun.YAML.parse(frontmatter) : {}) as { photo?: string }, body };
};

/** Paragraphs joined by a blank line, each on one line: the files wrap at 100 columns. */
const paragraphs = (body: string) =>
  body
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " "))
    .join("\n\n");

/** Markdown in two bios that came by their person's own pull request before the website's subset
 *  was held here, each held as `<file> <span>`: a changed span meets the rule. Remove one once it
 *  is gone; never add one (markdown.test.ts holds them). */
export const markdownAwaiting = new Set([
  "bastian-weinlich/bio.md *Agentic Engineering*",
  "bastian-weinlich/bio.md *“Softwareentwicklung mit agentischer KI – Verstehen, anwenden und etablieren im professionellen Kontext”*",
  "bastian-weinlich/bio.de.md *Agentic Engineering*",
  "bastian-weinlich/bio.de.md *„Softwareentwicklung mit agentischer KI – Verstehen, anwenden und etablieren im professionellen Kontext“*",
]);

type Node = {
  type: string;
  value?: string;
  position: { start: { offset: number }; end: { offset: number } };
  children?: Node[];
};
/** What the website renders of a bio (its src/data/practitioners.ts) is paragraphs of text and
 *  `[text](https:…)` or mailto links; anything else it prints as the characters typed, while this
 *  repository's page renders it. Returns each span outside that subset, as written. */
export function markdownOutside(body: string) {
  const source = (n: Node) => body.slice(n.position.start.offset, n.position.end.offset);
  // An escape or entity parses to a text whose value differs from what the website prints; the
  // website joins a paragraph's lines with one space, as `paragraphs` does.
  const squash = (s: string) => s.replace(/\s+/g, " ");
  const plain = (n: Node) =>
    (n.type === "text" && squash(n.value!) === squash(source(n))) ||
    (n.type === "break" && !source(n).trim());
  // `[text](https:…)`, or a bare address the website prints as the same characters.
  const link = (n: Node) =>
    n.type === "link" &&
    n.children!.length === 1 &&
    plain(n.children![0]!) &&
    (source(n) === n.children![0]!.value ||
      /^\[[^\]]+\]\((https|mailto):[^)\s]+\)$/.test(source(n)));
  return (markdownToMdast(body) as unknown as Node).children!.flatMap((block) =>
    block.type !== "paragraph"
      ? [source(block)]
      : block.children!.filter((n) => !plain(n) && !link(n)).map(source),
  );
}

/** Each folder's entry.json path and the text it must hold. */
export async function generate(dir = base) {
  const files = new Map<string, string>();
  for (const bio of new Glob("*/bio.md").scanSync(dir)) {
    const slug = bio.split("/")[0]!;
    // A link would read a file outside the folder into entry.json, or have the export write there.
    for (const f of readdirSync(`${dir}/${slug}`, { withFileTypes: true }))
      if (!f.isFile()) throw new Error(`${slug}: ${f.name} is not a regular file`);
    const { data, body } = split(await Bun.file(`${dir}/${bio}`).text());
    const de = Bun.file(`${dir}/${slug}/bio.de.md`);
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new Error(`${slug}: ${z.prettifyError(parsed.error)}`);
    const german = (await de.exists()) ? split(await de.text()).body : "";
    for (const [file, text] of [
      ["bio.md", body],
      ["bio.de.md", german],
    ] as const) {
      const held = (span: string) => markdownAwaiting.has(`${slug}/${file} ${span}`);
      const outside = markdownOutside(text).filter((span) => !held(span));
      if (outside.length)
        throw new Error(
          `${slug}/${file}: the website prints this as typed: ${outside.join(" | ")}`,
        );
    }
    // What the page's "Still missing" box lists keeps an entry a draft.
    const lacks = missing({ id: slug, body, data: parsed.data }, german);
    if (parsed.data.status === "active" && lacks.length)
      throw new Error(`${slug}: active, but missing ${lacks.join(", ")}`);
    // The schema typed photo as an image; the file holds the path next to bio.md.
    const { photo: _, ...rest } = parsed.data;
    const entry = {
      slug,
      ...rest,
      ...(data.photo && { photo: `practitioners/${slug}/${data.photo.replace(/^\.\//, "")}` }),
      bio: {
        en: paragraphs(body),
        de: paragraphs(german),
      },
    } as EntryJson;
    files.set(`${dir}/${slug}/entry.json`, `${JSON.stringify(entry, null, 2)}\n`);
  }
  return files;
}

if (import.meta.main) for (const [path, text] of await generate()) await Bun.write(path, text);
