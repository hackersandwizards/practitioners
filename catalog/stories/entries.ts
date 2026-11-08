// Stories draw real entries: the person's own data and the role the website's team page gives them,
// read as the overview reads them (src/pages/index.astro).
import { getEntry } from "astro:content";
import { listing, roster } from "../../src/lib/website";
import Frame from "./Frame.astro";

export const entry = async (slug: string) => {
  const found = await getEntry("practitioners", slug);
  if (!found) throw new Error(`no practitioner ${slug}: pick another entry for this story`);
  return found;
};

/** PersonCard's props for one entry, sized for the story's one-card column. */
export const card = async (slug: string) => {
  const e = await entry(slug);
  return { entry: e, ...listing(await roster(), e.data.name), sizes: "240px" };
};

/** The story's ground; `grid` holds a card in a list as the overview does, `state` forces the
 *  first link's hover or focus look. */
export const frame = (props: { grid?: boolean; state?: "hover" | "focus" } = {}) => ({
  component: Frame,
  props,
});
