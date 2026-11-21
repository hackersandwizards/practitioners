import { fc, test, unicodeString } from "@hackersandwizards/scaffolding/property";
import { expect } from "vitest";
import { offences } from "./pull-request-paths";

const root = "src/content/practitioners";
const slug = fc.string({
  unit: fc.constantFrom("a", "b", "1", "2", "-"),
  minLength: 1,
  maxLength: 32,
});
const record = (mode: string, name: string) => {
  const status = mode === "000000" ? "D" : mode === "120000" || mode === "160000" ? "T" : "M";
  const after = (status === "D" ? "0" : "2").repeat(40);
  return `:100644 ${mode} ${"1".repeat(40)} ${after} ${status}\0${name}\0`;
};

test.prop(
  [
    slug,
    unicodeString,
    fc.constantFrom("JPEG", "Jpg", "png", "WebP", "HEIC", "avif"),
    fc.constantFrom("100644", "000000", "120000", "100755", "160000"),
  ],
  {
    examples: [
      ["ada", "", "Jpg", "100644"],
      ["a-1", "Élodie\t李", "HEIC", "000000"],
      ["ada", "x".repeat(240), "avif", "120000"],
      ["ada", "__proto__", "WebP", "100755"],
      ["ada", "back\\slash\nline", "JPEG", "160000"],
    ],
  },
)(
  "accepts only regular files and deletions among supported image paths",
  (slug, stem, extension, mode) => {
    const name = `${root}/${slug}/image-${stem.replaceAll("/", "_").replaceAll("\0", "_")}.${extension}`;
    expect(offences(record(mode, name))).toEqual(
      mode === "100644" || mode === "000000" ? [] : [`${name}: mode ${mode}`],
    );
  },
);

test.prop([slug, unicodeString], {
  examples: [
    ["ada", ""],
    ["ada", "constructor"],
    ["ada", "Élodie/李"],
    ["ada", "x".repeat(240)],
  ],
})("rejects nested files, unsupported suffixes and case collisions", (slug, stem) => {
  const folder = `${root}/${slug}`;
  const name = stem.replaceAll("/", "_").replaceAll("\0", "_");
  const invalid = [
    `${folder}/nested/${name}.png`,
    `${folder}/${name}.png.ts`,
    `${folder}/Bio.md`,
    `${root}/upperA${slug}/bio.md`,
    `SRC/content/practitioners/${slug}/bio.md`,
    `${root}/with space${slug}/bio.md`,
  ];
  const collisions = [`${folder}/Photo.webp`, `${folder}/photo.WEBP`];
  expect(
    offences([...invalid, ...collisions].map((path) => record("100644", path)).join("")),
  ).toEqual([
    ...invalid.map((path) => `${path}: not a bio, entry.json or image in a practitioner's folder`),
    ...collisions.map((path) => `${path}: photo.webp in another case`),
  ]);
});

test.prop(
  [
    slug,
    fc.uniqueArray(
      fc.constantFrom("bio.md", "bio.de.md", "bio.short.md", "entry.json", "photo.webp"),
    ),
  ],
  {
    examples: [
      ["ada", []],
      ["a-1", ["bio.md", "bio.de.md", "bio.short.md", "entry.json", "photo.webp"]],
    ],
  },
)("counts distinct folders of allowed paths in first-seen order", (slug, names) => {
  const first = `${root}/${slug}`;
  const second = `${first}-other`;
  const changes = names.map((name) => record("100644", `${first}/${name}`)).join("");
  expect(offences(changes)).toEqual([]);
  expect(offences(record("100644", `${second}/bio.md`) + changes)).toEqual(
    names.length ? [`more than one folder: ${second}, ${first}`] : [],
  );
});
