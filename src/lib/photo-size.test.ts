import { expect, test } from "bun:test";
import { imageMetadata } from "astro/assets/utils";
import { Glob } from "bun";

/** The website's first team group at a 767 px window: 459 CSS px on a 2x screen. The website owns
 *  who sits in that group, so every portrait has to fit it. CONTRIBUTING.md states the number. */
const MIN_WIDTH = 918;

/** Portraits below the minimum today, on either side. Lower it when one reaches the minimum; a new portrait below
 *  the minimum raises it only after the person has been asked for a larger original. */
const AWAITING_ORIGINAL = 50;

test("the number of portraits below the minimum is AWAITING_ORIGINAL", async () => {
  const files = [...new Glob("src/content/practitioners/*/photo.webp").scanSync()];
  expect(files.length).toBeGreaterThan(0);
  const below: string[] = [];
  for (const file of files) {
    const { width, height } = await imageMetadata(await Bun.file(file).bytes());
    if (Math.min(width, height) < MIN_WIDTH) below.push(`${file}: ${width} x ${height} px`);
  }
  expect(below.length, below.sort().join("\n")).toBe(AWAITING_ORIGINAL);
});
