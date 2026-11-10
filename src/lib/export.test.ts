import { expect, test } from "bun:test";
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
