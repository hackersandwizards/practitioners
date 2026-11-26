import { fc, test } from "@hackersandwizards/scaffolding/property";
import { defined } from "@hackersandwizards/scaffolding/defined";
import { expect } from "vitest";
import { gains, sharpen } from "./retouch-portrait";

const channel = fc.integer({ min: 0, max: 255 });
const rgb = fc.tuple(channel, channel, channel);

test.prop([fc.array(rgb, { maxLength: 128 })], {
  examples: [
    [[]],
    [[[110, 0, 0]]],
    [[[0, 110, 0]]],
    [
      [
        [0, 0, 250],
        [0, 110, 0],
      ],
    ],
    [[[50, 50, 0]]],
    [[[0, 50, 50]]],
    [[[90, 0, 50]]],
    [
      [
        [130, 128, 122],
        [25, 25, 25],
        [230, 230, 230],
        [24, 24, 24],
        [231, 231, 231],
      ],
    ],
    [[[140, 120, 100]]],
    [
      [
        [0, 0, 0],
        [255, 255, 255],
      ],
    ],
  ],
})("balances usable RGB samples at half strength within five percent of neutral", (pixels) => {
  const usable = pixels.filter(([r, g, b]) => {
    const light = 299 * r + 587 * g + 114 * b;
    return light >= 25_000 && light <= 230_000;
  });
  const channels = [0, 1, 2] as const;
  const totals = channels.map((c) => usable.reduce((sum, pixel) => sum + pixel[c], 0));
  const neutral = totals.reduce((sum, total) => sum + total, 0) / 3;
  const expected = totals.includes(0)
    ? [1, 1, 1]
    : totals.map((sum) => Math.min(1.05, Math.max(0.95, (1 + neutral / sum) / 2)));
  expect(gains(Uint8Array.from(pixels.flat()))).toEqual(expected);
});

const dimension = fc.integer({ min: 1, max: 12 });

test.prop([rgb, dimension, dimension], {
  examples: [
    [[0, 0, 0], 1, 1],
    [[255, 255, 255], 12, 1],
    [[10, 128, 245], 1, 12],
  ],
})("sharpening preserves a uniform colour including image boundaries", (pixel, width, height) => {
  const before = new Uint8Array(width * height * 3);
  for (let i = 0; i < before.length; i += 3) before.set(pixel, i);
  const after = before.slice();
  sharpen(after, width, height);
  expect(after).toEqual(before);
});

type GreyLevels = { dark: number; light: number };

function edgeImage({ dark, light }: GreyLevels, half: number, stride: number) {
  const size = half * 2;
  const before = Uint8Array.from({ length: size * size * 3 }, (_, i) => {
    const pixel = Math.floor(i / 3);
    const axis = Math.floor(pixel / stride) % size;
    return (axis < half ? dark : light) + (i % 3) * 5;
  });
  return { before, size, left: (half - 1) * stride * 3, right: half * stride * 3 };
}

const edgeGeometry = fc
  .integer({ min: 8, max: 12 })
  .chain((half) => fc.constantFrom({ half, stride: half * 2 }, { half, stride: 1 }));

const edges = fc
  .tuple(
    fc.record({
      dark: fc.integer({ min: 50, max: 100 }),
      light: fc.integer({ min: 140, max: 205 }),
    }),
    edgeGeometry,
  )
  .map(([levels, { half, stride }]) => edgeImage(levels, half, stride));

test.prop([edges], {
  examples: [
    [edgeImage({ dark: 50, light: 205 }, 8, 16)],
    [edgeImage({ dark: 100, light: 140 }, 12, 1)],
  ],
})(
  "sharpens either edge orientation by the same amount in each channel away from clipping",
  ({ before, size, left, right }) => {
    const after = before.slice();
    sharpen(after, size, size);
    expect(after[left]).toBeLessThan(defined(before[left], "original dark edge sample"));
    expect(after[right]).toBeGreaterThan(defined(before[right], "original light edge sample"));
    for (let i = 0; i < before.length; i += 3) {
      const red = defined(after[i], "sharpened red sample");
      const green = defined(after[i + 1], "sharpened green sample");
      const blue = defined(after[i + 2], "sharpened blue sample");
      expect(green - red).toBe(5);
      expect(blue - red).toBe(10);
    }
  },
);
