import { expect, test } from "vitest";
import sharp from "sharp";
import { rejection } from "@hackersandwizards/scaffolding/rejection";
import { defined } from "@hackersandwizards/scaffolding/defined";
import {
  applyPortraitTreatment,
  gains,
  portraitFrame,
  retouch,
  sharpen,
  tone,
} from "./retouch-portrait";

const opaqueSolid = (width: number, height: number, background: string) =>
  sharp({ create: { width, height, channels: 3, background } })
    .png()
    .toBuffer();

const transparentSource = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 4, background: "#00000000" } })
    .png()
    .toBuffer();

test("the tone curve keeps black, white and the midtones, and lowers highlights by at most 4 levels", () => {
  const lut = tone();
  expect([lut[0], lut[128], lut[191], lut[255]]).toEqual([0, 128, 191, 255]);
  expect(defined(lut[230], "tone level at 230")).toBeLessThan(230);
  for (let i = 1; i < 256; i++) {
    const level = defined(lut[i], `tone level at ${i}`);
    expect(level).toBeGreaterThanOrEqual(defined(lut[i - 1], `tone level at ${i - 1}`));
    expect(i - level).toBeLessThanOrEqual(4);
  }
});

test("white balance includes coloured pixels at both exposure cutoffs", () => {
  expect(gains(Uint8Array.of(10, 34, 18))).toEqual([1.05, 0.95, 1.05]);
  expect(gains(Uint8Array.of(248, 242, 121))).toEqual([0.95, 0.95, 1.05]);
});

test("sharp-2 adds a symmetric halo at a horizontal edge and preserves faint detail", () => {
  const width = 12;
  const height = 8;
  const edge = new Uint8Array(width * height * 3).fill(175).fill(75, 0, 4 * width * 3);
  sharpen(edge, width, height);
  const column = (x: number) => Array.from({ length: height }, (_, y) => edge[(y * width + x) * 3]);
  expect(column(0)).toEqual([75, 75, 68, 52, 198, 182, 175, 175]);
  expect(column(width - 1)).toEqual(column(0));

  const stripe = [100, 100, 100, 103, 103, 103];
  const faint = Uint8Array.from(
    { length: width * height * 3 },
    (_, i) => stripe[i % stripe.length],
  );
  const before = faint.slice();
  sharpen(faint, width, height);
  expect(faint).toEqual(before);
});

test("a crop comes out square at the requested size as WebP, never upscaled", async () => {
  const src = await opaqueSolid(300, 200, "#808080");
  const out = await retouch(src, { crop: { x: 50, y: 20, side: 160 }, size: 120 });
  expect(await sharp(out).metadata()).toMatchObject({ format: "webp", width: 120, height: 120 });
  expect(await rejection(retouch(src, { crop: { x: 0, y: 0, side: 160 }, size: 200 }))).toContain(
    "--size 200 would upscale the 160 px crop",
  );
});

test("without options a source is cut square at its short side, capped at 1024, transparency white", async () => {
  expect(
    await sharp(await retouch(await opaqueSolid(1400, 1200, "#808080"))).metadata(),
  ).toMatchObject({
    width: 1024,
    height: 1024,
  });
  const clear = await retouch(await transparentSource(40, 60));
  expect(await sharp(clear).metadata()).toMatchObject({ width: 40, height: 40 });
  expect([...(await sharp(clear).raw().toBuffer()).subarray(0, 3)]).toEqual([255, 255, 255]);
});

test("an explicit portrait size can exceed the default cap without upscaling", async () => {
  const source = await opaqueSolid(1100, 1100, "#808080");
  const output = await retouch(source, { size: 1050 });
  expect(await sharp(output).metadata()).toMatchObject({ width: 1050, height: 1050 });
});

test("crop coordinates refer to the displayed orientation", async () => {
  const red = await opaqueSolid(16, 32, "#da2020");
  const input = await sharp(await opaqueSolid(48, 32, "#2020da"))
    .composite([{ input: red, left: 0, top: 0 }])
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer();
  const output = await retouch(input, { crop: { x: 4, y: 22, side: 16 }, size: 12 });
  const pixels = await sharp(output).raw().toBuffer();
  expect(pixels[0]).toBeLessThan(60);
  expect(pixels[2]).toBeGreaterThan(190);
  expect(await sharp(await retouch(input)).metadata()).toMatchObject({ width: 32, height: 32 });
});

test("optional portrait treatments reduce a cast and increase contrast at a resized edge", async () => {
  const width = 32;
  const leftHalf = Array.from({ length: width / 2 }, () => [120, 100, 80]).flat();
  const rightHalf = Array.from({ length: width / 2 }, () => [180, 160, 140]).flat();
  const row = Buffer.from([...leftHalf, ...rightHalf]);
  const pixelsByRow = Buffer.concat(Array.from({ length: width }, () => row));
  const input = await sharp(pixelsByRow, { raw: { width, height: width, channels: 3 } })
    .png()
    .toBuffer();
  const pixels = async (options: { retouch?: boolean; sharpen?: boolean }) =>
    sharp(await retouch(input, { size: 16, ...options }))
      .raw()
      .toBuffer();
  const plain = await pixels({});
  const balanced = await pixels({ retouch: true });
  const sharpened = await pixels({ sharpen: true });
  const left = (8 * 16 + 7) * 3;
  const right = left + 3;
  const balancedCast = defined(balanced[0], "balanced red") - defined(balanced[2], "balanced blue");
  const plainCast = defined(plain[0], "untreated red") - defined(plain[2], "untreated blue");
  const sharpenedContrast =
    defined(sharpened[right], "sharpened light edge") -
    defined(sharpened[left], "sharpened dark edge");
  const plainContrast =
    defined(plain[right], "untreated light edge") - defined(plain[left], "untreated dark edge");
  expect(balancedCast).toBeLessThan(plainCast - 5);
  expect(sharpenedContrast).toBeGreaterThan(plainContrast + 5);
});

test.each([
  {
    frame: "landscape",
    source: { width: 320, height: 240 },
    options: {},
    expected: { side: 240, size: 240 },
  },
  {
    frame: "cropped",
    source: { width: 320, height: 240 },
    options: { crop: { x: 8, y: 12, side: 200 } },
    expected: { side: 200, size: 200 },
  },
])("resolves portrait framing for the $frame case", ({ source, options, expected }) => {
  expect(portraitFrame(source, options)).toEqual(expected);
});

test("portrait treatment balances channels before rolling off highlights in place", () => {
  const rgb = Uint8Array.of(120, 100, 80, 220, 220, 220);
  applyPortraitTreatment(rgb);
  expect(rgb).toEqual(Uint8Array.of(116, 100, 83, 210, 216, 223));
});
