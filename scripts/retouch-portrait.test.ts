import { expect, test } from "bun:test";
import sharp from "sharp";
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
  expect(cast(140, 120, 100)).toEqual([0.95, expect.any(Number), 1.05]);
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

test("a crop comes out square at the requested size as WebP, never upscaled", async () => {
  const src = await solid(300, 200, "#808080");
  const out = await retouch(src, { crop: { x: 50, y: 20, side: 160 }, size: 120 });
  expect(await sharp(out).metadata()).toMatchObject({ format: "webp", width: 120, height: 120 });
  await expect(retouch(src, { crop: { x: 0, y: 0, side: 160 }, size: 200 })).rejects.toThrow(
    /upscale/,
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
