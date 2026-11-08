import { expect, test } from "bun:test";
import sharp from "sharp";
import { gains, retouch, sharpen, tone } from "./retouch-portrait";

const raw = async (webp: Buffer) => new Uint8Array(await sharp(webp).raw().toBuffer());

test("the tone curve keeps black, white and the midtones, and only lowers the highlights", () => {
  const lut = tone();
  expect([lut[0], lut[128], lut[191], lut[255]]).toEqual([0, 128, 191, 255]);
  expect(lut[230]!).toBeLessThan(230);
  for (let i = 1; i < 256; i++) expect(lut[i]!).toBeGreaterThanOrEqual(lut[i - 1]!);
});

test("white balance pulls a cast halfway toward grey, never more than 5 %", () => {
  const warm = new Uint8Array(300).map((_, i) => [140, 120, 100][i % 3]!);
  const [r, g, b] = gains(warm);
  expect(r).toBeLessThan(1);
  expect(b).toBeGreaterThan(1);
  expect(Math.max(Math.abs(r - 1), Math.abs(g - 1), Math.abs(b - 1))).toBeLessThanOrEqual(
    0.05 + 1e-9,
  );
});

test("sharp-2 steepens a luminance edge, leaves flat areas and colour alone", () => {
  const w = 16;
  const rgb = new Uint8Array(w * w * 3).map((_, i) => (Math.floor(i / 3) % w < 8 ? 80 : 160));
  const before = rgb.slice();
  sharpen(rgb, w, w);
  const at = (a: Uint8Array, x: number) => a[(4 * w + x) * 3]!;
  expect(at(rgb, 7)).toBeLessThan(at(before, 7));
  expect(at(rgb, 8)).toBeGreaterThan(at(before, 8));
  expect(at(rgb, 2)).toBe(at(before, 2));
  for (let p = 0; p < w * w; p++) expect(rgb[p * 3]).toBe(rgb[p * 3 + 2]!); // grey stays grey
});

test("a crop comes out square at the requested size, as WebP, and never upscaled", async () => {
  const src = await sharp({
    create: { width: 300, height: 200, channels: 3, background: "#808080" },
  })
    .png()
    .toBuffer();
  const out = await retouch(src, { crop: { x: 50, y: 20, side: 160 }, size: 120, sharpen: true });
  expect(await sharp(out).metadata()).toMatchObject({ format: "webp", width: 120, height: 120 });
  expect((await raw(out))[0]).toBeCloseTo(128, -1);
  await expect(retouch(src, { crop: { x: 0, y: 0, side: 160 }, size: 200 })).rejects.toThrow(
    /upscale/,
  );
});
