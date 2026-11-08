import Portrait from "../../../src/components/Portrait.astro";
import { entry, frame } from "../entries";

export default { component: Portrait };

const aaron = (await entry("aaron-spring")).data;
const portrait = (data: typeof aaron) => ({
  data,
  alt: "",
  widths: [240, 480],
  sizes: "240px",
  class: "size-60",
});

export const Photo = { args: portrait(aaron), decorators: [frame()] };
export const Initials = { args: portrait({ ...aaron, photo: undefined }), decorators: [frame()] };
