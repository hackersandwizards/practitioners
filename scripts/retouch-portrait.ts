// Deterministic portrait treatment, the same for every face and never a local edit of it:
// optional square crop, white balance by channel gain, a tone curve whose soft highlight roll-off
// tames skin shine, resize to the master size, and optionally sharp-2: an unsharp mask on luminance
// only (radius 1.2 px, amount 70 %, threshold 2) at that size. WebP q82, as the website's
// scripts/optimize-media.mjs encodes portraits. It never upscales.
//
//   bun run portrait <in> <out.webp> [--crop x,y,side] [--size px] [--sharpen] [--plain]
//
// --crop is the square in source pixels (head and shoulders, eyes about 40 % from the top);
// --size defaults to the crop's side, capped at 1024; --plain skips white balance and tone.
import sharp from "sharp";

/** Gray-world gains at half strength, each within 5 % of neutral: a cast is pulled toward neutral
 *  without repainting a coloured wall behind the person. */
export function gains(rgb: Uint8Array): [number, number, number] {
  const sum = [0, 0, 0];
  let n = 0;
  for (let i = 0; i < rgb.length; i += 3) {
    const y = 0.299 * rgb[i]! + 0.587 * rgb[i + 1]! + 0.114 * rgb[i + 2]!;
    if (y < 25 || y > 230) continue; // shadows and clipped highlights carry no cast
    sum[0] += rgb[i]!;
    sum[1] += rgb[i + 1]!;
    sum[2] += rgb[i + 2]!;
    n++;
  }
  if (!n) return [1, 1, 1];
  const grey = (sum[0]! + sum[1]! + sum[2]!) / 3;
  return sum.map((s) => Math.min(1.05, Math.max(0.95, 1 + (grey / s - 1) / 2))) as [
    number,
    number,
    number,
  ];
}

/** Identity below 0.75, then a shoulder that only lowers: 1.0 stays 1.0, the highlights between
 *  come down by up to 4 grey levels. */
export function tone(roll = 0.5): Uint8Array {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let x = i / 255;
    if (x > 0.75) {
      const t = (x - 0.75) / 0.25;
      x = 0.75 + 0.25 * (t - roll * 0.5 * t * (1 - t));
    }
    lut[i] = Math.round(x * 255);
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
 *  channels alike, so colour stays as it was. */
export function sharpen(
  rgb: Uint8Array,
  width: number,
  height: number,
  sigma = 1.2,
  amount = 0.7,
  threshold = 2,
) {
  const y = new Float32Array(width * height);
  for (let p = 0; p < y.length; p++)
    y[p] = 0.299 * rgb[p * 3]! + 0.587 * rgb[p * 3 + 1]! + 0.114 * rgb[p * 3 + 2]!;
  const blurred = blur(y, width, height, sigma);
  for (let p = 0; p < y.length; p++) {
    const d = y[p]! - blurred[p]!;
    if (Math.abs(d) <= threshold) continue;
    for (let c = 0; c < 3; c++)
      rgb[p * 3 + c] = Math.min(255, Math.max(0, Math.round(rgb[p * 3 + c]! + amount * d)));
  }
}

export interface Options {
  crop?: { x: number; y: number; side: number };
  size?: number;
  sharpen?: boolean;
  plain?: boolean;
}

export async function retouch(input: string | Buffer, o: Options = {}): Promise<Buffer> {
  let img = sharp(input).rotate().toColourspace("srgb").removeAlpha();
  const meta = await sharp(input).metadata();
  const side = o.crop?.side ?? Math.min(meta.width, meta.height);
  if (o.crop) img = img.extract({ left: o.crop.x, top: o.crop.y, width: side, height: side });
  else if (meta.width !== meta.height)
    img = img.resize(side, side, { fit: "cover", position: "attention" });
  const size = o.size ?? Math.min(side, 1024);
  if (size > side) throw new Error(`--size ${size} would upscale the ${side} px crop`);
  const full = await img.raw().toBuffer({ resolveWithObject: true });
  const rgb = new Uint8Array(full.data);
  if (!o.plain) {
    const g = gains(rgb);
    const lut = tone();
    for (let i = 0; i < rgb.length; i++)
      rgb[i] = lut[Math.min(255, Math.round(rgb[i]! * g[i % 3]!))]!;
  }
  const raw = { width: full.info.width, height: full.info.height, channels: 3 as const };
  const sized = new Uint8Array(
    await sharp(rgb, { raw }).resize(size, size, { kernel: "lanczos3" }).raw().toBuffer(),
  );
  if (o.sharpen) sharpen(sized, size, size);
  return sharp(sized, { raw: { width: size, height: size, channels: 3 } })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toBuffer();
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const flag = (name: string) => {
    const i = args.indexOf(name);
    return i < 0 ? undefined : args.splice(i, 2)[1];
  };
  const crop = flag("--crop")?.split(",").map(Number);
  const size = flag("--size");
  const opts: Options = {
    crop: crop && { x: crop[0]!, y: crop[1]!, side: crop[2]! },
    size: size ? Number(size) : undefined,
    sharpen: args.includes("--sharpen"),
    plain: args.includes("--plain"),
  };
  const [input, output] = args.filter((a) => !a.startsWith("--"));
  if (!input || !output)
    throw new Error(
      "usage: bun run portrait <in> <out.webp> [--crop x,y,side] [--size px] [--sharpen] [--plain]",
    );
  await Bun.write(output, await retouch(input, opts));
}
