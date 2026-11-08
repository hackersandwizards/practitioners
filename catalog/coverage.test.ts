// Every component has a story file named after it, and the hub's header links the catalog.
import { expect, test } from "bun:test";
import { basename } from "node:path";
import { Glob } from "bun";

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
