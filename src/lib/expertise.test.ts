import { expect, test } from "vitest";
import { schema } from "../../scripts/export";

test("schema.ts says the website imports expertiseProblem rather than copying it", async () => {
  const text = await Bun.file("src/lib/schema.ts").text();
  expect(text).toContain("imports `expertiseProblem` from `practitioners/schema`");
});

test("the schema reports expertise problems on the affected translation", () => {
  const result = schema.safeParse({
    name: "Ada Example",
    expertise: { en: "AI evaluation", de: "Head of Quality" },
  });
  expect(result.error?.issues).toEqual([
    { code: "custom", message: "no job title", path: ["expertise", "de"] },
  ]);
});

test("the schema requires a portrait for an active entry", () => {
  const name = "Ada Example";
  expect(schema.safeParse({ name, status: "draft" }).success).toBe(true);
  const active = schema.safeParse({ name, status: "active" });
  expect(active.error?.issues[0]?.message).toBe("an active entry needs a photo");
});
