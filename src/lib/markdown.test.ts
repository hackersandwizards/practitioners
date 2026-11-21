import { expect, test } from "vitest";
import { Glob } from "bun";
import { base, markdownAwaiting, markdownOutside } from "../../scripts/export";
import { split } from "./bio-text";

test("markdownAwaiting only shrinks: each held span is still in its bio", async () => {
  const held = new Set<string>();
  for (const file of new Glob("*/bio{,.de}.md").scanSync(base))
    for (const span of markdownOutside(split(await Bun.file(`${base}/${file}`).text()).body))
      held.add(`${file} ${span}`);
  for (const key of markdownAwaiting) expect(held.has(key), `${key} is gone: remove it`).toBe(true);
});

test("an inline dash suffix in YAML stays part of the name", () => {
  expect(split("---\nname: X---\n---\nBio.")).toEqual({
    data: { name: "X---" },
    body: "Bio.",
  });
});
