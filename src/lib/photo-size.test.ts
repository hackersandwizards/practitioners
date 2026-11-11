import { expect, test } from "bun:test";
import { imageMetadata } from "astro/assets/utils";
import { Glob } from "bun";
import { portraitMinimum } from "./schema";

/** Portraits below the minimum today, on either side. Lower it when one reaches the minimum; a new
 *  portrait below the minimum raises it only after the person has been asked for a larger original. */
const AWAITING_ORIGINAL = 49;

test("CONTRIBUTING.md states portraitMinimum", async () => {
  const text = await Bun.file("CONTRIBUTING.md").text();
  expect(text).toContain(`at least ${portraitMinimum} by ${portraitMinimum} pixels`);
});

test("the number of portraits below the minimum is AWAITING_ORIGINAL", async () => {
  const files = [...new Glob("src/content/practitioners/*/photo.webp").scanSync()];
  expect(files.length).toBeGreaterThan(0);
  const below: string[] = [];
  for (const file of files) {
    const { width, height } = await imageMetadata(await Bun.file(file).bytes());
    if (Math.min(width, height) < portraitMinimum) below.push(`${file}: ${width} x ${height} px`);
  }
  expect(below.length, below.sort().join("\n")).toBe(AWAITING_ORIGINAL);
});
