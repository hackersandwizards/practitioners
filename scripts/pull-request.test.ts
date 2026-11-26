import { expect, test } from "vitest";
import { offences } from "./pull-request-paths";

const z = "0000000000000000000000000000000000000000";
const addition = (path: string) => `:000000 100644 ${z} ${z} A\0${path}\0`;
const folder = "src/content/practitioners/ada-example";

test("a pull request cannot add a test or lint config for the gate to run", () => {
  const raw = [
    addition(`${folder}/x.test.ts`),
    addition(`${folder}/eslint.config.js`),
    addition("src/lib/photo-size.test.ts"),
  ].join("");
  expect(offences(raw)).toEqual([
    `${folder}/x.test.ts: not a bio, entry.json or image in a practitioner's folder`,
    `${folder}/eslint.config.js: not a bio, entry.json or image in a practitioner's folder`,
    "src/lib/photo-size.test.ts: not a bio, entry.json or image in a practitioner's folder",
  ]);
});

test("a malformed git diff record without a file mode throws rather than reporting undefined", () => {
  expect(() => offences(`:000000\0${folder}/bio.md\0`)).toThrow(
    `malformed git diff record for ${folder}/bio.md: :000000`,
  );
});
