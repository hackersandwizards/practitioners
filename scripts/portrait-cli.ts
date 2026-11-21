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
