import { expect, test } from "vitest";
import sharp from "sharp";
import { rejection } from "@hackersandwizards/scaffolding/rejection";
import { gains, retouch, sharpen, tone } from "./retouch-portrait";

const solid = (width: number, height: number, background: string, channels: 3 | 4 = 3) =>
  sharp({ create: { width, height, channels, background } }).png().toBuffer();

test("the tone curve keeps black, white and the midtones, and lowers highlights by at most 4 levels", () => {
  const lut = tone();
  expect([lut[0], lut[128], lut[191], lut[255]]).toEqual([0, 128, 191, 255]);
  expect(lut[230]!).toBeLessThan(230);
  for (let i = 1; i < 256; i++) {
    expect(lut[i]!).toBeGreaterThanOrEqual(lut[i - 1]!);
    expect(i - lut[i]!).toBeLessThanOrEqual(4);
  }
});

test("white balance pulls a small cast halfway toward grey and a large one at most 5 %", () => {
  const cast = (r: number, g: number, b: number) =>
    gains(new Uint8Array(300).map((_, i) => [r, g, b][i % 3]!));
  const grey = (130 + 128 + 122) / 3;
  const [r, , b] = cast(130, 128, 122);
  expect(r).toBeCloseTo(1 + (grey / 130 - 1) / 2, 6);
  expect(b).toBeCloseTo(1 + (grey / 122 - 1) / 2, 6);
  const clipped = cast(140, 120, 100);
  expect(clipped).toHaveLength(3);
  expect(clipped).toMatchObject([0.95, expect.any(Number), 1.05]);
});

test("white balance keeps samples at the exposure limits and disregards darker or brighter pixels", () => {
  const midtone = [130, 128, 122];
  const atLimits = [...midtone, 25, 25, 25, 230, 230, 230];
  const withOutliers = [...atLimits, 0, 14, 50, 250, 241, 230];
  const balanced = gains(Uint8Array.from(atLimits));
  expect(gains(Uint8Array.from(withOutliers))).toEqual(balanced);
  expect(balanced[0]).toBeGreaterThan(gains(Uint8Array.from(midtone))[0]!);
  expect(balanced[0]).toBeLessThan(1);
  for (const unusable of [
    [0, 0, 0],
    [255, 255, 255],
    [110, 0, 0],
    [0, 110, 0],
  ])
    expect(gains(Uint8Array.from(unusable))).toEqual([1, 1, 1]);
});

test("sharp-2 steepens a luminance edge, leaves flat areas alone and adds the same to each channel", () => {
  const w = 16;
  const rgb = new Uint8Array(w * w * 3).map((_, i) =>
    Math.floor(i / 3) % w < 8 ? [90, 80, 70][i % 3]! : [170, 160, 150][i % 3]!,
  );
  const before = rgb.slice();
  sharpen(rgb, w, w);
  const at = (a: Uint8Array, x: number, c = 0) => a[(4 * w + x) * 3 + c]!;
  expect(at(rgb, 7)).toBeLessThan(at(before, 7));
  expect(at(rgb, 8)).toBeGreaterThan(at(before, 8));
  expect(at(rgb, 2)).toBe(at(before, 2));
  for (const x of [7, 8])
    expect(at(rgb, x, 0) - at(rgb, x, 2)).toBe(at(before, x, 0) - at(before, x, 2));
});

test("sharp-2 adds a symmetric halo at a horizontal edge and preserves faint detail", () => {
  const width = 12;
  const height = 8;
  const edge = Uint8Array.from({ length: width * height * 3 }, (_, i) =>
    i < 4 * width * 3 ? 75 : 175,
  );
  sharpen(edge, width, height);
  const column = (x: number) => Array.from({ length: height }, (_, y) => edge[(y * width + x) * 3]);
  expect(column(0)).toEqual([75, 75, 68, 52, 198, 182, 175, 175]);
  expect(column(width - 1)).toEqual(column(0));

  const faint = Uint8Array.from({ length: width * height * 3 }, (_, i) =>
    Math.floor(i / 3) % 2 ? 103 : 100,
  );
  const before = faint.slice();
  sharpen(faint, width, height);
  expect(faint).toEqual(before);
});

test("a crop comes out square at the requested size as WebP, never upscaled", async () => {
  const src = await solid(300, 200, "#808080");
  const out = await retouch(src, { crop: { x: 50, y: 20, side: 160 }, size: 120 });
  expect(await sharp(out).metadata()).toMatchObject({ format: "webp", width: 120, height: 120 });
  expect(await rejection(retouch(src, { crop: { x: 0, y: 0, side: 160 }, size: 200 }))).toContain(
    "--size 200 would upscale the 160 px crop",
  );
});

test("without options a source is cut square at its short side, capped at 1024, transparency white", async () => {
  expect(await sharp(await retouch(await solid(1400, 1200, "#808080"))).metadata()).toMatchObject({
    width: 1024,
    height: 1024,
  });
  const clear = await retouch(await solid(40, 60, "#00000000", 4));
  expect(await sharp(clear).metadata()).toMatchObject({ width: 40, height: 40 });
  expect([...(await sharp(clear).raw().toBuffer()).subarray(0, 3)]).toEqual([255, 255, 255]);
});

test("crop coordinates refer to the displayed orientation", async () => {
  const red = await solid(16, 32, "#da2020");
  const input = await sharp(await solid(48, 32, "#2020da"))
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
  const input = await sharp(
    Buffer.from(
      Array.from({ length: width * width }, (_, i) =>
        i % width < width / 2 ? [120, 100, 80] : [180, 160, 140],
      ).flat(),
    ),
    { raw: { width, height: width, channels: 3 } },
  )
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
  expect(balanced[0]! - balanced[2]!).toBeLessThan(plain[0]! - plain[2]! - 5);
  expect(sharpened[right]! - sharpened[left]!).toBeGreaterThan(plain[right]! - plain[left]! + 5);
});
