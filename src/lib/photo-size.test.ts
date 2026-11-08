// A portrait covers the largest slot the website can give it, or adds to the count of portraits
// still waiting for a larger original. `bun test` runs this in the gate.
import { expect, test } from "bun:test";
import { imageMetadata } from "astro/assets/utils";
import { Glob } from "bun";

/** The website's first team group at a 767 px window: 459 CSS px on a 2x screen. The website owns
 *  who sits in that group, so every portrait has to fit it. */
const MIN_WIDTH = 918;

/** Portraits below the minimum today. Lower it when one reaches the minimum; a new portrait below
 *  the minimum raises it only after the person has been asked for a larger original. */
const AWAITING_ORIGINAL = 51;

test("portraits below the minimum do not grow in number", async () => {
  const files = [...new Glob("src/content/practitioners/*/photo.webp").scanSync()];
  expect(files.length).toBeGreaterThan(0);
  const below: string[] = [];
  for (const file of files) {
    const bytes = new Uint8Array(await Bun.file(file).arrayBuffer());
    const { width } = await imageMetadata(bytes);
    if (width < MIN_WIDTH) below.push(`${file}: ${width} px`);
  }
  expect(below.length, below.sort().join("\n")).toBe(AWAITING_ORIGINAL);
});
