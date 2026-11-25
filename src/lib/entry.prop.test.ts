import { fc, test, unicodeString } from "@hackersandwizards/scaffolding/property";
import { expect } from "vitest";
import { affiliation, bareName, links, missing } from "./entry";

const draft = { name: "Ada Example", status: "draft" } as const;
const whitespace = fc.constantFrom(" ", "\t", "\n", "\u2003", "  ");

test.prop([unicodeString, whitespace], {
  examples: [
    ["", " "],
    ["Élodie 李", "\u2003"],
    ["ä".repeat(1024), "\t"],
  ],
})("removes a leading Dr. and its whitespace, while preserving an embedded title", (name, gap) => {
  expect(bareName(`Dr.${gap}${name}`)).toBe(name.trimStart());
  expect(bareName(`Ada Dr.${gap}${name}`)).toBe(`Ada Dr.${gap}${name}`);
  expect(bareName(`Drx${gap}${name}`)).toBe(`Drx${gap}${name}`);
  expect(bareName(`Dr.x${name}`)).toBe(`Dr.x${name}`);
});

test.prop([unicodeString, fc.constantFrom("staff", "freelance", "partner", "guest", undefined)], {
  examples: [
    ["constructor", "staff"],
    ["__proto__", "freelance"],
    ["toString", undefined],
    ["Équipe", "partner"],
  ],
})("an explicit affiliation takes precedence over the relationship", (value, relation) => {
  expect(affiliation({ ...draft, affiliation: value, relation })).toBe(value);
});

const profile = fc.tuple(
  fc.constantFrom("www.", "", "sub.www."),
  fc.integer({ min: 1, max: 65535 }),
  unicodeString,
);

test.prop([fc.array(profile)], {
  examples: [
    [[]],
    [
      [
        ["www.", 443, "é/李"],
        ["sub.www.", 8443, ""],
        ["", 1, "constructor"],
        ["www.", 65535, "toString"],
        ["www.", 443, "é/李"],
      ],
    ],
    [[["", 1234, "ä".repeat(1024)]]],
  ],
})("keeps extra profile URLs in input order and labels them by host", (sites) => {
  const hrefs = sites.map(
    ([prefix, port, value]) => `https://${prefix}example.com:${port}/${encodeURIComponent(value)}`,
  );
  expect(links({ ...draft, profiles: hrefs })).toEqual(
    sites.map(([prefix, port], index) => ({
      label: `${prefix === "sub.www." ? prefix : ""}example.com${port === 443 ? "" : `:${port}`}`,
      href: hrefs[index],
    })),
  );
});

const texts = (label: string) =>
  fc.oneof(
    fc.constant({ text: undefined, lacks: [label] }),
    whitespace.map((text) => ({ text, lacks: [label] })),
    fc.constant({ text: "", lacks: [label] }),
    unicodeString.map((text) => ({
      text: `Text ${text.replaceAll("Seed draft", "Seed_draft")}`,
      lacks: [],
    })),
  );

const englishBio = texts("English bio");
const englishRequirement = fc.oneof(
  englishBio,
  englishBio.map(({ text }) => ({
    text: `Text. Seed draft: ${text ?? ""}`,
    lacks: ["English bio"],
  })),
);
const germanRequirement = texts("German bio");
const linkedInRequirement = fc.constantFrom(
  { id: "ada", linkedin: undefined, lacks: ["LinkedIn"] },
  { id: "ada", linkedin: "https://example.com/ada", lacks: [] },
  { id: "reachy", linkedin: undefined, lacks: [] },
  { id: "reachy", linkedin: "https://example.com/ada", lacks: [] },
);
const portraitRequirement = fc.constantFrom(
  { photo: undefined, lacks: ["Portrait"] },
  { photo: "./photo.webp", lacks: [] },
);
const entryRequirements = fc
  .tuple(englishRequirement, germanRequirement, linkedInRequirement, portraitRequirement)
  .map(([english, german, linkedIn, portrait]) => ({
    entry: {
      id: linkedIn.id,
      body: english.text,
      data: { linkedin: linkedIn.linkedin, photo: portrait.photo },
    },
    german: german.text,
    expected: [...english.lacks, ...german.lacks, ...linkedIn.lacks, ...portrait.lacks],
  }));

test.prop([entryRequirements], {
  examples: [
    [
      {
        entry: { id: "ada", body: "", data: { linkedin: undefined, photo: undefined } },
        german: "\n",
        expected: ["English bio", "German bio", "LinkedIn", "Portrait"],
      },
    ],
    [
      {
        entry: {
          id: "reachy",
          body: "Écrit.",
          data: { linkedin: undefined, photo: "./photo.webp" },
        },
        german: "Übersetzt.",
        expected: [],
      },
    ],
    [
      {
        entry: {
          id: "ada",
          body: "Text. Seed draft: English",
          data: { linkedin: "https://example.com/ada", photo: "./photo.webp" },
        },
        german: "Deutsch",
        expected: ["English bio"],
      },
    ],
  ],
})("lists each missing requirement in display order", ({ entry, german, expected }) => {
  expect(missing(entry, german)).toEqual(expected);
});
