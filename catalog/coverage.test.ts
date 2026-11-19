import { expect, test } from "vitest";
import { basename } from "node:path";
import { Glob } from "bun";
import { pages } from "../brand-elements.json";

const names = (pattern: string, ext: string) =>
  [...new Glob(pattern).scanSync()].map((f) => basename(f, ext)).sort();

test("every component in src/components has a story", () => {
  const components = names("src/components/*.astro", ".astro");
  expect(components.length).toBeGreaterThan(0);
  expect(names("catalog/stories/**/*.stories.ts", ".stories.ts")).toEqual(components);
});

test("the header links the catalog", async () => {
  expect(await Bun.file("src/layouts/Layout.astro").text()).toContain('href="/catalog/"');
});

test("every entry a story, the catalog's home or brand-elements.json draws exists", async () => {
  const sources = [...new Glob("catalog/**/*.{ts,astro}").scanSync()].map((f) =>
    Bun.file(f).text(),
  );
  const named = (await Promise.all(sources)).flatMap((t) =>
    [...t.matchAll(/\b(?:card|entry)\("([^"]+)"\)/g)].map((m) => m[1]!),
  );
  const slugs = [
    ...named,
    ...pages.map((p) => p.replaceAll("/", "")).filter((s) => s && s !== "catalog"),
  ];
  expect(slugs.length).toBeGreaterThan(0);
  const gone = slugs.filter((s) => !Bun.file(`src/content/practitioners/${s}/bio.md`).size);
  expect(gone).toEqual([]);
});
