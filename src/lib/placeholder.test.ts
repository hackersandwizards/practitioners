import { expect, test } from "bun:test";
import { schema } from "../../scripts/export";

/** CONTRIBUTING.md's example block, its link lines uncommented and their handles left unfilled. */
const example = async () => {
  const text = await Bun.file("CONTRIBUTING.md").text();
  const block = text.match(/```yaml\n(name: Ada Example\n[\s\S]*?)```/)![1];
  return Bun.YAML.parse(block.replace(/^# ?/gm, "")) as Record<string, unknown>;
};

const issues = (data: Record<string, unknown>) =>
  (schema.safeParse(data).error?.issues ?? []).map((i) => i.path.join("."));

test("the unfilled link lines of CONTRIBUTING.md's example fail, a filled one passes", async () => {
  const data = await example();
  expect(issues(data)).toEqual(["linkedin", "github", "profiles.0"]);
  expect(issues({ ...data, linkedin: "https://www.linkedin.com/in/ada-example/" })).toContain(
    "linkedin",
  );
  expect(
    issues({
      ...data,
      linkedin: "https://www.linkedin.com/in/ada-lovelace/",
      github: "https://github.com/adalovelace",
      profiles: ["https://speakerdeck.com/adalovelace"],
    }),
  ).toEqual([]);
});
