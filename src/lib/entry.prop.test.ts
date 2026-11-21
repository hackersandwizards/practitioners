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

const bio = fc.oneof(
  fc.constant({ text: undefined, blank: true }),
  whitespace.map((text) => ({ text, blank: true })),
  fc.constant({ text: "", blank: true }),
  unicodeString.map((text) => ({
    text: `Text ${text.replaceAll("Seed draft", "Seed_draft")}`,
    blank: false,
  })),
);

test.prop([bio, bio, fc.boolean(), fc.boolean(), fc.boolean(), fc.boolean()], {
  examples: [
    [{ text: "", blank: true }, { text: "\n", blank: true }, false, false, false, false],
    [
      { text: "Écrit.", blank: false },
      { text: "Übersetzt.", blank: false },
      true,
      false,
      true,
      false,
    ],
    [{ text: "English", blank: false }, { text: "Deutsch", blank: false }, false, true, true, true],
  ],
})(
  "lists each missing requirement in display order",
  (english, german, familiar, linkedin, photo, seed) => {
    const entry = {
      id: familiar ? "reachy" : "ada",
      body: seed ? `Text. Seed draft: ${english.text ?? ""}` : english.text,
      data: {
        linkedin: linkedin ? "https://example.com/ada" : undefined,
        photo: photo ? "./photo.webp" : undefined,
      },
    };
    expect(missing(entry, german.text)).toEqual([
      ...(english.blank || seed ? ["English bio"] : []),
      ...(german.blank ? ["German bio"] : []),
      ...(!linkedin && !familiar ? ["LinkedIn"] : []),
      ...(!photo ? ["Portrait"] : []),
    ]);
  },
);
