import Links from "../../../src/components/Links.astro";
import { entry, frame } from "../entries";

export default { component: Links };

const many = (await entry("benedikt-stemmildt")).data;

export const Many = { args: { data: many }, decorators: [frame()] };
export const LinkedInOnly = {
  args: { data: (await entry("bastian-weinlich")).data },
  decorators: [frame()],
};
export const Hover = { args: { data: many }, decorators: [frame({ state: "hover" })] };
export const Focus = { args: { data: many }, decorators: [frame({ state: "focus" })] };
