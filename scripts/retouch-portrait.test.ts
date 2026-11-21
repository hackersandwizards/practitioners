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

test("white balance includes coloured pixels at both exposure cutoffs", () => {
  expect(gains(Uint8Array.of(10, 34, 18))).toEqual([1.05, 0.95, 1.05]);
  expect(gains(Uint8Array.of(248, 242, 121))).toEqual([0.95, 0.95, 1.05]);
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
