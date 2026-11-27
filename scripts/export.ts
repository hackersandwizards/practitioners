// The website loads each practitioner's JSON in plain Node, keeping protected names in their own folders.
import type { SchemaContext } from "astro:content";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { Glob } from "bun";
import { markdownToMdast, type MdastNode } from "satteri";
import { z } from "zod";
import { paragraphs, split } from "../src/lib/bio-text";
import { missing } from "../src/lib/entry";
import { practitionerSchema, type EntryJson } from "../src/lib/schema";

export const base = join(import.meta.dir, "../src/content/practitioners");

// The photo field holds a path; the website resolves it, so the schema checks a string here.
export const schema = practitionerSchema({ image: () => z.string() } as unknown as SchemaContext);

/** Markdown in two bios that came by their person's own pull request before the website's subset
 *  was held here, each held as `<file> <span>`: a changed span meets the rule. Remove one once it
 *  is gone; never add one (markdown.test.ts holds them). */
export const markdownAwaiting = new Set([
  "bastian-weinlich/bio.md *Agentic Engineering*",
  "bastian-weinlich/bio.md *“Softwareentwicklung mit agentischer KI – Verstehen, anwenden und etablieren im professionellen Kontext”*",
  "bastian-weinlich/bio.de.md *Agentic Engineering*",
  "bastian-weinlich/bio.de.md *„Softwareentwicklung mit agentischer KI – Verstehen, anwenden und etablieren im professionellen Kontext“*",
]);

/** What the website renders of a bio (its src/data/practitioners.ts) is paragraphs of text and
 *  `[text](https://…)` or mailto links; anything else it prints as the characters typed, while this
 *  repository's page renders it. Returns each span outside that subset, as written. */
export function markdownOutside(body: string) {
  const source = (n: MdastNode) => {
    const start = n.position?.start.offset;
    const end = n.position?.end.offset;
    if (start === undefined || end === undefined)
      throw new Error(`mdast ${n.type} node has no source offsets`);
    return body.slice(start, end);
  };
  // An escape or entity parses to a text whose value differs from what the website prints; the
  // website joins a paragraph's lines with one space, as `paragraphs` does.
  const squash = (s: string) => s.replace(/\s+/g, " ");
  const plain = (n: MdastNode) =>
    (n.type === "text" && squash(n.value) === squash(source(n))) ||
    (n.type === "break" && !source(n).trim());
  // `[text](https://…)`, or a bare address the website prints as the same characters.
  const link = (n: MdastNode) => {
    if (n.type !== "link" || n.children.length !== 1) return false;
    const [child] = n.children;
    return (
      plain(child) &&
      ((child.type === "text" && source(n) === child.value) ||
        /^\[[^\]]+\]\((https:\/\/|mailto:)[^)\s]+\)$/.test(source(n)))
    );
  };
  return markdownToMdast(body).children.flatMap((block) =>
    block.type !== "paragraph"
      ? [source(block)]
      : block.children.filter((n) => !plain(n) && !link(n)).map(source),
  );
}

type FolderBios = { english: string; german: string };

async function readEntryFolder(dir: string, slug: string, bio: string): Promise<FolderBios> {
  // A link would read a file outside the folder into entry.json, or have the export write there.
  for (const f of readdirSync(`${dir}/${slug}`, { withFileTypes: true }))
    if (!f.isFile()) throw new Error(`${slug}: ${f.name} is not a regular file`);
  const english = await Bun.file(`${dir}/${bio}`).text();
  const de = Bun.file(`${dir}/${slug}/bio.de.md`);
  const german = (await de.exists()) ? await de.text() : "";
  return { english, german };
}

function entryFromBios(slug: string, bios: FolderBios): EntryJson {
  const { data, body } = split(bios.english);
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error(`${slug}: ${z.prettifyError(parsed.error)}`);
  const german = split(bios.german).body;
  for (const [file, text] of [
    ["bio.md", body],
    ["bio.de.md", german],
  ] as const) {
    const held = (span: string) => markdownAwaiting.has(`${slug}/${file} ${span}`);
    const outside = markdownOutside(text).filter((span) => !held(span));
    if (outside.length)
      throw new Error(`${slug}/${file}: the website prints this as typed: ${outside.join(" | ")}`);
  }
  const lacks = missing({ id: slug, body, data: parsed.data }, german);
  if (parsed.data.status === "active" && lacks.length)
    throw new Error(`${slug}: active, but missing ${lacks.join(", ")}`);
  if (data.photo && data.photo !== "./photo.webp")
    throw new Error(`${slug}: photo is ${data.photo}, not ./photo.webp`);
  const { photo: _, ...rest } = parsed.data;
  return {
    slug,
    ...rest,
    ...(data.photo && { photo: `practitioners/${slug}/photo.webp` }),
    bio: {
      en: paragraphs(body),
      de: paragraphs(german),
    },
  } as EntryJson;
}

/** Each folder's entry.json path and the text it must hold. */
export async function generate(dir = base) {
  const files = new Map<string, string>();
  for (const bio of new Glob("*/bio.md").scanSync(dir)) {
    const slug = dirname(bio);
    const entry = entryFromBios(slug, await readEntryFolder(dir, slug, bio));
    files.set(`${dir}/${slug}/entry.json`, `${JSON.stringify(entry, null, 2)}\n`);
  }
  return files;
}

if (import.meta.main) for (const [path, text] of await generate()) await Bun.write(path, text);
