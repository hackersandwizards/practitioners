import PersonCard from "../../../src/components/PersonCard.astro";
import { card, frame } from "../entries";

export default { component: PersonCard };

const grid = [frame({ grid: true })];

// Every story but NotOnTheWebsite draws a name the website lists, so a state is set on an entry
// rather than picking a seed that has it.
const aaron = await card("aaron-spring");
const withData = (data: Partial<typeof aaron.entry.data>) => ({
  ...aaron,
  entry: { ...aaron.entry, data: { ...aaron.entry.data, ...data } },
});

export const Approved = { args: aaron, decorators: grid };
export const Draft = { args: withData({ status: "draft" }), decorators: grid };
export const AtACompany = {
  args: { ...(await card("johann-laur")), company: "Tudock" },
  decorators: grid,
};
export const NoPortraitYet = { args: withData({ photo: undefined }), decorators: grid };
export const NotOnTheWebsite = { args: await card("reachy"), decorators: grid };
export const LongName = {
  args: await card("luis-fernando-de-la-torre-delgado"),
  decorators: grid,
};
export const Hover = { args: aaron, decorators: [frame({ grid: true, state: "hover" })] };
export const Focus = { args: aaron, decorators: [frame({ grid: true, state: "focus" })] };
