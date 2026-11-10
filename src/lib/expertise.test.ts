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

test("expertiseAwaiting only shrinks: each line still breaks the rule, in one entry, and none is added", () => {
  for (const line of expertiseAwaiting) {
    expect(
      [
        "Engineering leadership, change and quality",
        "Engineering-Leadership, Wandel und Qualität",
        "Agentic Engineering, AI-assisted software development, software architecture",
        "Agentic Engineering, KI-gestützte Softwareentwicklung, Softwarearchitektur",
      ],
      line,
    ).toContain(line);
    const holders = entries.filter((e) => e.expertise?.en === line || e.expertise?.de === line);
    expect(holders.length, line).toBe(1);
    expect(expertiseProblem(line), `"${line}" fits now: remove it`).toBeDefined();
  }
});
