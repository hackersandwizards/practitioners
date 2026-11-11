import { expect, test } from "bun:test";
import { offences } from "./pull-request";

const z = "0000000000000000000000000000000000000000";
const line = (mode: string, path: string, status = "M") =>
  `:100644 ${mode} ${z} ${z} ${status}\0${path}\0`;
const folder = "src/content/practitioners/ada-example";

test("a pull request's own bios, entry.json and an image under any name pass", () => {
  const raw = [
    line("100644", `${folder}/bio.md`),
    line("100644", `${folder}/bio.de.md`, "A"),
    line("100644", `${folder}/entry.json`),
    line("100644", `${folder}/My Portrait.JPG`, "A"),
    line("000000", `${folder}/old.png`, "D"),
  ].join("");
  expect(offences(raw)).toEqual([]);
});

test("a file the gate would run, a link, an executable or a second folder fails", () => {
  const raw = [
    line("100644", `${folder}/x.test.ts`, "A"),
    line("100644", `${folder}/eslint.config.js`, "A"),
    line("120000", `${folder}/bio.de.md`),
    line("100755", `${folder}/photo.webp`),
    line("100644", "src/content/practitioners/someone-else/bio.md"),
    line("100644", "src/lib/photo-size.test.ts"),
    // Each collides with the real path on a case-insensitive checkout.
    line("100644", `${folder}/Bio.md`, "A"),
    line("100644", `SRC/content/practitioners/ada-example/bio.md`, "A"),
    line("100644", "src/content/practitioners/Ada-Example/bio.md", "A"),
    line("100644", "src/content/practitioners/ada example/bio.md", "A"),
  ].join("");
  expect(offences(raw)).toEqual([
    `${folder}/x.test.ts: not a bio, entry.json or image in a practitioner's folder`,
    `${folder}/eslint.config.js: not a bio, entry.json or image in a practitioner's folder`,
    `${folder}/bio.de.md: mode 120000`,
    `${folder}/photo.webp: mode 100755`,
    "src/lib/photo-size.test.ts: not a bio, entry.json or image in a practitioner's folder",
    `${folder}/Bio.md: not a bio, entry.json or image in a practitioner's folder`,
    "SRC/content/practitioners/ada-example/bio.md: not a bio, entry.json or image in a practitioner's folder",
    "src/content/practitioners/Ada-Example/bio.md: not a bio, entry.json or image in a practitioner's folder",
    "src/content/practitioners/ada example/bio.md: not a bio, entry.json or image in a practitioner's folder",
    "more than one folder: src/content/practitioners/ada-example, src/content/practitioners/someone-else",
  ]);
});
