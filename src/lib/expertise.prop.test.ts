import { fc, test } from "@hackersandwizards/scaffolding/property";
import { expect } from "vitest";
import { schema } from "../../scripts/export";
import { expertiseProblem } from "./schema";

const word = fc.string({
  unit: fc.constantFrom("é", "界", "x", "a", "ü"),
  minLength: 1,
  maxLength: 256,
});

const affiliationSpelling = fc
  .tuple(
    fc.constantFrom("freelance", "hackers&wizards"),
    fc.nat(),
    fc.constantFrom("", " ", "\t", "\u2003"),
    fc.boolean(),
  )
  .map(([key, index, gap, upper]) => {
    const offset = 1 + (index % (key.length - 1));
    const spelling = `${key.slice(0, offset)}${gap}${key.slice(offset)}`;
    return { key, affiliation: upper ? spelling.toUpperCase() : spelling };
  });

test.prop([affiliationSpelling], {
  examples: [
    [{ key: "freelance", affiliation: "freelance" }],
    [{ key: "freelance", affiliation: "FREELANCE" }],
    [{ key: "hackers&wizards", affiliation: "hackers\u2003&wizards" }],
    [{ key: "hackers&wizards", affiliation: "HACKERS&\tWIZARDS" }],
  ],
})(
  "reserves case and whitespace variants of an own affiliation for its exact key",
  ({ key, affiliation }) => {
    expect(schema.safeParse({ name: "Example", affiliation }).success).toBe(affiliation === key);
  },
);

test.prop(
  [
    fc.array(word, { maxLength: 8 }),
    fc.constantFrom(" ", "\t", "\u2003", "  "),
    fc.constantFrom("", "Director", "eNGINEER", "Manager", "Head of", "CTO", "Lead"),
  ],
  {
    examples: [
      [[], " ", ""],
      [["a", "é", "界"], "\t", ""],
      [["a", "b", "c", "d"], " ", ""],
      [["é".repeat(256)], "\u2003", ""],
      [[], " ", "Lead"],
      [["a", "b"], " ", "Head of"],
    ],
  },
)("reports the word limit before the title restriction", (words, gap, title) => {
  const line = [title, ...words].filter(Boolean).join(gap);
  const count = words.length + (title === "Head of" ? 2 : Number(Boolean(title)));
  expect(expertiseProblem(`${gap}${line}${gap}`)).toBe(
    count > 3 ? "three words or fewer" : title ? "no job title" : undefined,
  );
});
