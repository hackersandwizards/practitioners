import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Glob } from "bun";
import { base, generate, schema } from "../../scripts/export";
import pkg from "../../package.json";

const files = await generate();
const photos = [...files.values()].flatMap((text) => JSON.parse(text).photo ?? []);

test("each entry.json matches its entry; `bun run export` rewrites them", async () => {
  const onDisk = [...new Glob("*/entry.json").scanSync(base)].map((f) => `${base}/${f}`).sort();
  expect(onDisk).toEqual([...files.keys()].sort());
  for (const [path, text] of files) expect(await Bun.file(path).text(), path).toBe(text);
});

test("the package exports every entry.json and portrait under the path it names", async () => {
  const target = pkg.exports["./practitioners/*"];
  expect(target).toBe("./src/content/practitioners/*");
  expect(photos.length).toBeGreaterThan(0);
  const exists = await Promise.all(
    photos.map((photo: string) =>
      Bun.file(`${base}/${photo.slice("practitioners/".length)}`).exists(),
    ),
  );
  const missing = photos.filter((_: string, i: number) => !exists[i]);
  expect(missing).toEqual([]);
});

test("staff need a job and a partner's trainer an affiliation", () => {
  const job = { en: "CFO", de: "CFO" };
  const ok = (d: object) => schema.safeParse({ name: "A B", ...d }).success;
  expect(ok({ relation: "staff" })).toBe(false);
  expect(ok({ relation: "staff", job })).toBe(true);
  expect(ok({ relation: "partner" })).toBe(false);
  expect(ok({ relation: "partner", affiliation: "WPS" })).toBe(true);
  expect(ok({ relation: "freelance" })).toBe(true);
});

test("an own affiliation is written as its key, never as a variant that would read as a company", () => {
  const ok = (affiliation: string) => schema.safeParse({ name: "A B", affiliation }).success;
  expect(["freelance", "hackers&wizards", "INNOQ"].map(ok)).toEqual([true, true, true]);
  expect(["Freelance", "hackers & wizards", "Hackers&Wizards"].map(ok)).toEqual([
    false,
    false,
    false,
  ]);
});

test("a name allowed in package.json or in file names is one a practitioner's folder entry allows", () => {
  const allow = pkg.scaffolding.allow as { path: string; text: string | string[] }[];
  const key = (s: string) => s.toLowerCase().normalize("NFC");
  const owned = allow
    .filter((a) => a.path.startsWith("src/content/practitioners/"))
    .flatMap((a) => [a.text].flat().map(key));
  const orphans = allow
    .filter((a) => a.path === "package.json" || a.path === "file names")
    .flatMap((a) => [a.text].flat())
    .filter((t) => !owned.includes(key(t)));
  expect(orphans).toEqual([]);
});

/** generate() over one folder `ada` holding the given files; `"link"` makes a symlink to a file
 *  beside the folder. */
async function generateOne(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "practitioners-export-"));
  try {
    mkdirSync(join(dir, "ada"));
    await Bun.write(join(dir, "outside.txt"), "a local file\n");
    for (const [name, content] of Object.entries(files))
      if (content === "link") symlinkSync(join(dir, "outside.txt"), join(dir, "ada", name));
      else await Bun.write(join(dir, "ada", name), content);
    return [...(await generate(dir)).values()].map((text) => JSON.parse(text));
  } finally {
    rmSync(dir, { recursive: true });
  }
}

const bio = "---\nname: Ada Example\n---\n\nAda trains teams.\n";

test("a folder holding a link fails the export rather than following it", async () => {
  expect((await generateOne({ "bio.md": bio }))[0].bio.en).toBe("Ada trains teams.");
  for (const name of ["bio.de.md", "entry.json"])
    await expect(generateOne({ "bio.md": bio, [name]: "link" })).rejects.toThrow(
      `ada: ${name} is not a regular file`,
    );
});

test("a bio holds only what the website renders: paragraphs and https or mailto links", async () => {
  const ok = "A [talk](https://example.com/a), [mail](mailto:a@example.com) and FLINTA* voices.";
  expect((await generateOne({ "bio.md": bio, "bio.de.md": ok }))[0].bio.de).toBe(ok);
  for (const de of [
    "*em*",
    "- a\n- b",
    "<b>x</b>",
    "[x](javascript:alert(1))",
    "\\*",
    "&amp;",
    "a  \nb",
  ])
    await expect(generateOne({ "bio.md": bio, "bio.de.md": de })).rejects.toThrow(
      "ada/bio.de.md: the website prints this as typed",
    );
});

test("an active entry lacking what the page's box lists fails the export", async () => {
  const active =
    "---\nname: Ada Example\nphoto: ./photo.webp\nstatus: active\n---\n\nAda trains teams.\n";
  await expect(
    generateOne({ "bio.md": active, "bio.de.md": "Ada trainiert Teams." }),
  ).rejects.toThrow("ada: active, but missing LinkedIn");
  expect(await generateOne({ "bio.md": active.replace("active", "draft") })).toHaveLength(1);
});

test("an empty frontmatter in bio.de.md is not bio text", async () => {
  expect(
    (await generateOne({ "bio.md": bio, "bio.de.md": "---\n---\nAda trainiert Teams." }))[0].bio.de,
  ).toBe("Ada trainiert Teams.");
});

test("bio.short.md holds at most 300 characters", async () => {
  for (const f of new Glob("*/bio.short.md").scanSync(base))
    expect((await Bun.file(`${base}/${f}`).text()).trim().length, f).toBeLessThanOrEqual(300);
});
