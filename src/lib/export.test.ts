import { expect, test } from "bun:test";
import { Glob } from "bun";
import { base, generate } from "../../scripts/export";
import pkg from "../../package.json";

const files = await generate();
const entries: { photo?: string; bio: { en: string; de: string } }[] = [...files.values()].map(
  (text) => JSON.parse(text),
);

test("each entry.json matches its entry; `bun run export` rewrites them", async () => {
  const onDisk = [...new Glob("*/entry.json").scanSync(base)].map((f) => `${base}/${f}`).sort();
  expect(onDisk).toEqual([...files.keys()].sort());
  for (const [path, text] of files) expect(await Bun.file(path).text(), path).toBe(text);
});

test("the package exports every entry.json and portrait under the path it names", async () => {
  const target = pkg.exports["./practitioners/*"];
  expect(target).toBe(`./${base}/*`);
  const photos = entries.flatMap(({ photo }) => (photo ? [photo] : []));
  expect(photos.length).toBeGreaterThan(0);
  const missing = [];
  for (const photo of photos)
    if (!(await Bun.file(target.replace("*", photo.slice("practitioners/".length))).exists()))
      missing.push(photo);
  expect(missing).toEqual([]);
});

test("every bio paragraph is one line", () => {
  expect(entries.some(({ bio }) => bio.en.includes("\n\n"))).toBe(true);
  const wrapped = entries.filter(({ bio }) => /[^\n]\n[^\n]/.test(bio.en + bio.de));
  expect(wrapped).toEqual([]);
});
