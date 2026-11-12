import { z } from "zod";

/** Who hackersandwizards.dev/team/ shows, with the role and credential line it prints under each
 *  name and their profile there, read from the roster the website publishes at /team.json; reading
 *  it keeps the roster the website's own (CLAUDE.md). Undefined when it is unreachable, so the
 *  overview says it does not know rather than marking everyone as missing. An answer of another
 *  shape throws: the website changed its data, and the build must say so. */
export const team = "https://www.hackersandwizards.dev/team/";
export const source = "https://www.hackersandwizards.dev/team.json";

const person = z.object({
  slug: z.string(),
  role: z.string(),
  description: z
    .string()
    .nullable()
    .transform((d) => d ?? undefined),
  url: z.url({ protocol: /^https$/ }),
});
type Person = z.output<typeof person>;
const people = z.array(person).nonempty();

/** What the website prints about the person in folder `slug`, and whether it lists them at all.
 *  While the roster is unknown, everyone counts as listed rather than as missing. */
export const listing = (web: Map<string, Person> | undefined, slug: string) => {
  const p = web?.get(slug);
  return { job: p?.role, description: p?.description, url: p?.url, listed: !web || !!p };
};

export async function load(): Promise<Map<string, Person> | undefined> {
  let body: string;
  try {
    const res = await fetch(source, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return undefined;
    body = await res.text();
  } catch {
    return undefined;
  }
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {} // not JSON: the shape check below names it
  const parsed = people.safeParse(json);
  if (!parsed.success)
    throw new Error(`${source} answered in another shape: ${z.prettifyError(parsed.error)}`);
  return new Map(parsed.data.map((p) => [p.slug, p]));
}

let cached: ReturnType<typeof load> | undefined;
/** Fetched once per process: the dev server renders the overview on every request, a build every
 *  page. In the dev server an unreachable or failing roster is asked again on the next request, so
 *  one started offline recovers; a build keeps the answer rather than waiting out each timeout. */
export const roster = () =>
  (cached ??= load().then(
    (r) => {
      if (!r && import.meta.env.DEV) cached = undefined;
      return r;
    },
    (e) => {
      cached = undefined;
      throw e;
    },
  ));
