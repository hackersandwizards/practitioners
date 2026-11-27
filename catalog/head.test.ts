import { expect, test } from "vitest";
import { runInNewContext } from "node:vm";
import { defined } from "@hackersandwizards/scaffolding/defined";

test("the catalog head leaves data-hw-night to the shell", async () => {
  const head = await Bun.file(new URL("./Head.astro", import.meta.url)).text();
  const scripts = [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
    defined(m[1], "catalog head script body"),
  );
  const attributes = new Set<string>();
  const classes = new Set<string>();
  const dataset: Record<string, string> = {};
  const document = {
    documentElement: {
      setAttribute: (name: string) => attributes.add(name),
      classList: { add: (name: string) => classes.add(name) },
      dataset,
    },
  };
  for (const script of scripts) runInNewContext(script, { document });
  expect(classes.has("hw-focus-ring")).toBe(true);
  expect(attributes.has("data-hw-night")).toBe(false);
  expect(Object.hasOwn(dataset, "hwNight")).toBe(false);
});
