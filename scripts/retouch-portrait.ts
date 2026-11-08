// Turns a source photo into a square WebP master, never upscaled. By default it only crops,
// resizes and encodes. Two optional treatments (CLAUDE.md says when to keep one):
//   --retouch  white balance by channel gain and a tone curve whose highlight shoulder tames skin
//              shine, at full resolution; never a local edit of the face
//   --sharpen  sharp-2: an unsharp mask on luminance only (radius 1.2 px, amount 70 %, threshold 2)
//              at the master size
//
//   bun run portrait <in> <out.webp> [--crop x,y,side] [--size px] [--retouch] [--sharpen]
//
// --crop is the square in source pixels (head and shoulders, eyes about 40 % from the top); without
// it a non-square source is cut square by sharp's attention strategy. --size defaults to the
// crop's side, capped at 1024 px, the practitioner-bio skill's cap. WebP q82.
import { parseArgs } from "node:util";
import sharp from "sharp";

const luma = (rgb: Uint8Array, p: number) =>
  0.299 * rgb[p * 3]! + 0.587 * rgb[p * 3 + 1]! + 0.114 * rgb[p * 3 + 2]!;

/** Gray-world gains at half strength, each within 5 % of neutral: a cast is pulled toward neutral
 *  without repainting a coloured wall behind the person. */
export function gains(rgb: Uint8Array): number[] {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let p = 0; p < rgb.length / 3; p++) {
    const y = luma(rgb, p);
    if (y < 25 || y > 230) continue; // shadows and clipped highlights carry no cast
    r += rgb[p * 3]!;
    g += rgb[p * 3 + 1]!;
    b += rgb[p * 3 + 2]!;
  }
  if (!r || !g || !b) return [1, 1, 1];
  const grey = (r + g + b) / 3;
  return [r, g, b].map((s) => Math.min(1.05, Math.max(0.95, 1 + (grey / s - 1) / 2)));
}

/** Identity below 0.75, then a shoulder that only lowers: 1.0 stays 1.0, the highlights between
 *  come down by up to 4 grey levels. */
export function tone(): Uint8Array {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const t = Math.max(0, (i / 255 - 0.75) / 0.25);
    lut[i] = Math.round((i / 255 - 0.25 * 0.25 * t * (1 - t)) * 255);
  }
  return lut;
}

/** Gaussian blur of a single float channel, separable, edges clamped. */
function blur(src: Float32Array, width: number, height: number, sigma: number) {
  const r = Math.ceil(3 * sigma);
  const k = Array.from({ length: 2 * r + 1 }, (_, i) =>
    Math.exp(-((i - r) ** 2) / (2 * sigma ** 2)),
  );
  const sum = k.reduce((a, b) => a + b);
  const pass = (a: Float32Array, dx: number, dy: number) => {
    const out = new Float32Array(a.length);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        let v = 0;
        for (let i = -r; i <= r; i++) {
          const xx = Math.min(width - 1, Math.max(0, x + i * dx));
          const yy = Math.min(height - 1, Math.max(0, y + i * dy));
          v += k[i + r]! * a[yy * width + xx]!;
        }
        out[y * width + x] = v / sum;
      }
    return out;
  };
  return pass(pass(src, 1, 0), 0, 1);
}

/** sharp-2 in place on interleaved RGB: luminance detail above the threshold, added to all three
 *  channels alike, so the colour differences between channels stay as they were. */
export function sharpen(rgb: Uint8Array, width: number, height: number) {
  const y = Float32Array.from({ length: width * height }, (_, p) => luma(rgb, p));
  const blurred = blur(y, width, height, 1.2);
  for (let p = 0; p < y.length; p++) {
    const d = y[p]! - blurred[p]!;
    if (Math.abs(d) <= 2) continue;
    for (let c = 0; c < 3; c++)
      rgb[p * 3 + c] = Math.min(255, Math.max(0, Math.round(rgb[p * 3 + c]! + 0.7 * d)));
  }
}

interface Options {
  crop?: { x: number; y: number; side: number };
  size?: number;
  retouch?: boolean;
  sharpen?: boolean;
}

export async function retouch(input: string | Buffer, o: Options = {}): Promise<Buffer> {
  let img = sharp(input)
    .rotate()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toColourspace("srgb");
  const meta = await img.metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.height;
  const side = o.crop?.side ?? Math.min(width, height);
  if (o.crop) img = img.extract({ left: o.crop.x, top: o.crop.y, width: side, height: side });
  else if (width !== height) img = img.resize(side, side, { fit: "cover", position: "attention" });
  const size = o.size ?? Math.min(side, 1024);
  if (size > side) throw new Error(`--size ${size} would upscale the ${side} px crop`);
  const rgb = new Uint8Array(await img.raw().toBuffer());
  if (o.retouch) {
    const g = gains(rgb);
    const lut = tone();
    for (let i = 0; i < rgb.length; i++)
      rgb[i] = lut[Math.min(255, Math.round(rgb[i]! * g[i % 3]!))]!;
  }
  const raw = (w: number) => ({ raw: { width: w, height: w, channels: 3 as const } });
  const sized = new Uint8Array(
    await sharp(rgb, raw(side)).resize(size, size, { kernel: "lanczos3" }).raw().toBuffer(),
  );
  if (o.sharpen) sharpen(sized, size, size);
  return sharp(sized, raw(size)).webp({ quality: 82, effort: 6, smartSubsample: true }).toBuffer();
}

if (import.meta.main) {
  const usage =
    "usage: bun run portrait <in> <out.webp> [--crop x,y,side] [--size px] [--retouch] [--sharpen]";
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      crop: { type: "string" },
      size: { type: "string" },
      retouch: { type: "boolean" },
      sharpen: { type: "boolean" },
    },
  });
  const int = (s: string, min: number) => {
    if (!/^\d+$/.test(s) || Number(s) < min)
      throw new Error(`not a whole number >= ${min}: ${s}\n${usage}`);
    return Number(s);
  };
  const crop = values.crop?.split(",");
  if (crop && crop.length !== 3) throw new Error(`--crop takes x,y,side\n${usage}`);
  const [input, output] = positionals;
  if (!input || !output || positionals.length > 2) throw new Error(usage);
  const opts: Options = {
    crop: crop && { x: int(crop[0]!, 0), y: int(crop[1]!, 0), side: int(crop[2]!, 1) },
    size: values.size === undefined ? undefined : int(values.size, 1),
    retouch: values.retouch,
    sharpen: values.sharpen,
  };
  await Bun.write(output, await retouch(input, opts));
}
