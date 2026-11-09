import { expect, test } from "bun:test";
import { expertiseAwaiting, expertiseProblem } from "./schema";
import { generate, schema } from "../../scripts/export";

const entries = [...(await generate()).values()].map((text) => JSON.parse(text));

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

test("expertiseAwaiting only shrinks: each line still breaks the rule, and none is added", () => {
  for (const line of expertiseAwaiting) {
    expect(
      [
        "Engineering leadership, change and quality",
        "Agentic Engineering, AI-assisted software development, software architecture",
      ],
      line,
    ).toContain(line);
    const entry = entries.find((e) => e.expertise?.en === line);
    expect(entry, line).toBeDefined();
    const { en, de } = entry.expertise;
    expect(
      expertiseProblem(en) ?? expertiseProblem(de),
      `"${line}" fits now: remove it`,
    ).toBeDefined();
  }
});
