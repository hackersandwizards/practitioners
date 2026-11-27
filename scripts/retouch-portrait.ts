// The optional highlight roll-off softens skin shine across the whole image.
import sharp from "sharp";

const lumaThousandths = (rgb: Uint8Array, p: number) =>
  299 * rgb[p * 3] + 587 * rgb[p * 3 + 1] + 114 * rgb[p * 3 + 2];

/** Gray-world gains at half strength, each within 5 % of neutral: a cast is pulled toward neutral
 *  without repainting a coloured wall behind the person. */
export function gains(rgb: Uint8Array): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let p = 0; p < rgb.length / 3; p++) {
    const y = lumaThousandths(rgb, p);
    if (y < 25_000 || y > 230_000) continue; // shadows and clipped highlights carry no cast
    r += rgb[p * 3];
    g += rgb[p * 3 + 1];
    b += rgb[p * 3 + 2];
  }
  if (!r || !g || !b) return [1, 1, 1];
  const grey = (r + g + b) / 3;
  const gain = (s: number) => Math.min(1.05, Math.max(0.95, 1 + (grey / s - 1) / 2));
  return [gain(r), gain(g), gain(b)];
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

type ImagePlane = { pixels: Float32Array; width: number; height: number };

/** Gaussian blur of a single float channel, separable, edges clamped. */
function blur({ pixels, width, height }: ImagePlane, sigma: number) {
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
          v += k[i + r] * a[yy * width + xx];
        }
        out[y * width + x] = v / sum;
      }
    return out;
  };
  return pass(pass(pixels, 1, 0), 0, 1);
}

/** sharp-2 in place on interleaved RGB: luminance detail above the threshold, added to all three
 *  channels alike, so the colour differences between channels stay as they were. */
export function sharpen(rgb: Uint8Array, width: number, height: number) {
  const y = Float32Array.from({ length: width * height }, (_, p) => lumaThousandths(rgb, p) / 1000);
  const blurred = blur({ pixels: y, width, height }, 1.2);
  for (let p = 0; p < y.length; p++) {
    const d = y[p] - blurred[p];
    if (Math.abs(d) <= 2) continue;
    for (let c = 0; c < 3; c++)
      rgb[p * 3 + c] = Math.min(255, Math.max(0, Math.round(rgb[p * 3 + c] + 0.7 * d)));
  }
}

export interface Options {
  crop?: { x: number; y: number; side: number };
  size?: number;
  retouch?: boolean;
  sharpen?: boolean;
}

type SourceSize = { width: number; height: number };

export function portraitFrame(
  { width, height }: SourceSize,
  { crop, size: requested }: Pick<Options, "crop" | "size">,
) {
  const side = crop?.side ?? Math.min(width, height);
  const size = requested ?? Math.min(side, 1024);
  if (size > side) throw new Error(`--size ${size} would upscale the ${side} px crop`);
  return { side, size };
}

export function applyPortraitTreatment(rgb: Uint8Array) {
  const g = gains(rgb);
  const lut = tone();
  for (let i = 0; i < rgb.length; i++) rgb[i] = lut[Math.min(255, Math.round(rgb[i] * g[i % 3]))];
}

export async function retouch(input: string | Buffer, o: Options = {}): Promise<Buffer> {
  let img = sharp(input)
    .rotate()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toColourspace("srgb");
  const meta = await img.metadata();
  const { width, height } = meta.autoOrient ?? meta;
  if (o.crop) {
    const { x, y, side } = o.crop;
    img = img.extract({ left: x, top: y, width: side, height: side });
  }
  const { side, size } = portraitFrame({ width, height }, o);
  if (!o.crop && width !== height)
    img = img.resize(side, side, { fit: "cover", position: "attention" });
  const rgb = await img.raw().toBuffer();
  if (o.retouch) applyPortraitTreatment(rgb);
  const raw = (w: number) => ({ raw: { width: w, height: w, channels: 3 as const } });
  const sized = await sharp(rgb, raw(side))
    .resize(size, size, { kernel: "lanczos3" })
    .raw()
    .toBuffer();
  if (o.sharpen) sharpen(sized, size, size);
  return sharp(sized, raw(size)).webp({ quality: 82, effort: 6, smartSubsample: true }).toBuffer();
}
