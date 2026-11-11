import { expect, test } from "bun:test";
import { expertiseProblem } from "./schema";
import { schema } from "../../scripts/export";

test("expertiseProblem catches a long line and a job title, as the website's test does", () => {
  expect(expertiseProblem("AI and data leadership coach")).toBe("three words or fewer");
  expect(expertiseProblem("Director of Engineering")).toBe("no job title");
  expect(expertiseProblem(" AI agent evaluation ")).toBeUndefined();
  const ok = (en: string) => schema.safeParse({ name: "A B", expertise: { en, de: en } }).success;
  expect([ok("Engineering leadership"), ok("Head of Quality"), ok("one two three four")]).toEqual([
    true,
    false,
    false,
  ]);
});
