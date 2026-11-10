import { expect, test } from "bun:test";
import { Glob } from "bun";
import { base, markdownAwaiting, markdownOutside } from "../../scripts/export";

test("markdownAwaiting only shrinks: each held span is still in a bio", async () => {
  const bios = [...new Glob("*/bio{,.de}.md").scanSync(base)].map((f) => Bun.file(`${base}/${f}`));
  const spans = new Set(
    (await Promise.all(bios.map((f) => f.text()))).flatMap((t) =>
      markdownOutside(t.replace(/^---\n[\s\S]*?\n---\n/, "")),
    ),
  );
  for (const span of markdownAwaiting)
    expect(spans.has(span), `${span} is gone: remove it`).toBe(true);
});
