import { expect, test } from "bun:test";
import { Glob } from "bun";
import { base, markdownAwaiting, markdownOutside, split } from "../../scripts/export";

test("markdownAwaiting only shrinks: each held span is still in its bio", async () => {
  const held = new Set<string>();
  for (const file of new Glob("*/bio{,.de}.md").scanSync(base))
    for (const span of markdownOutside(split(await Bun.file(`${base}/${file}`).text()).body))
      held.add(`${file} ${span}`);
  for (const key of markdownAwaiting) expect(held.has(key), `${key} is gone: remove it`).toBe(true);
});

test("bare addresses print as typed, so they pass; their Markdown forms do not", () => {
  expect(
    markdownOutside("At https://example.com, www.example.com or kontakt@example.com."),
  ).toEqual([]);
  expect(markdownOutside("<https://example.com> [x](http://example.com)")).toHaveLength(2);
});
