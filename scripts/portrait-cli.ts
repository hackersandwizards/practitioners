import { parseArgs } from "node:util";
import { retouch, type Options } from "./retouch-portrait";

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
const parseCrop = (raw: string) => {
  const [x, y, side, ...extra] = raw.split(",");
  if (x === undefined || y === undefined || side === undefined || extra.length > 0)
    throw new Error(`--crop takes x,y,side\n${usage}`);
  return { x: int(x, 0), y: int(y, 0), side: int(side, 1) };
};
const [input, output] = positionals;
if (!input || !output || positionals.length > 2) throw new Error(usage);
const opts: Options = {
  crop: values.crop === undefined ? undefined : parseCrop(values.crop),
  size: values.size === undefined ? undefined : int(values.size, 1),
  retouch: values.retouch,
  sharpen: values.sharpen,
};
await Bun.write(output, await retouch(input, opts));
