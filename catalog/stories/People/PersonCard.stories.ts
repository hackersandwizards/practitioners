import PersonCard from "../../../src/components/PersonCard.astro";
import { card, frame } from "../entries";

export default { component: PersonCard };

const grid = [frame({ grid: true })];

export const Approved = { args: await card("aaron-spring"), decorators: grid };
export const Draft = { args: await card("bastian-weinlich"), decorators: grid };
export const NotOnTheWebsite = { args: await card("reachy"), decorators: grid };
export const LongName = {
  args: await card("luis-fernando-de-la-torre-delgado"),
  decorators: grid,
};
export const Hover = {
  args: await card("aaron-spring"),
  decorators: [frame({ grid: true, state: "hover" })],
};
export const Focus = {
  args: await card("aaron-spring"),
  decorators: [frame({ grid: true, state: "focus" })],
};
