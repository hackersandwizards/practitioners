import PersonCard from "../../../src/components/PersonCard.astro";
import { card, frame } from "../entries";

export default { component: PersonCard };

const grid = [frame({ grid: true })];

export const Approved = { args: await card("aaron-spring"), decorators: grid };
export const Draft = { args: await card("bastian-weinlich"), decorators: grid };
export const AtACompany = {
  args: { ...(await card("johann-laur")), company: "Tudock" },
  decorators: grid,
};
// Stories draw only names the website lists, so the portrait is taken away rather than picking a
// seed that has none.
const aaron = await card("aaron-spring");
export const NoPortraitYet = {
  args: { ...aaron, entry: { ...aaron.entry, data: { ...aaron.entry.data, photo: undefined } } },
  decorators: grid,
};
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
