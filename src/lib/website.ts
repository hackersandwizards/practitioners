/** Who hackersandwizards.dev/team/ shows, with the role it prints under each name. The website
 *  publishes both as schema.org Person in the page's JSON-LD; reading that published page keeps
 *  the roster the website's own (CLAUDE.md). Undefined when the page is unreachable, so the
 *  overview says it does not know rather than marking everyone as missing. A page that answers
 *  without Person nodes throws: the website changed its data, and the build must say so. */
export const team = "https://www.hackersandwizards.dev/team/";

type Node = { "@type"?: string; name?: string; jobTitle?: string };

/** Names compare in NFC, so the same name typed with combining marks still matches. */
export const nameKey = (name: string) => name.normalize("NFC");

/** The role the website prints under a name, and whether it lists the person at all. While the
 *  roster is unknown, everyone counts as listed rather than as missing. */
export const listing = (web: Map<string, string> | undefined, name: string) => {
  const job = web?.get(nameKey(name));
  return { job, listed: !web || job !== undefined };
};

async function load(): Promise<Map<string, string> | undefined> {
  let html: string;
  try {
    const res = await fetch(team, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return undefined;
    html = await res.text();
  } catch {
    return undefined;
  }
  const nodes = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ].flatMap(([, json]) => {
    const data = JSON.parse(json!);
    return (Array.isArray(data) ? data : (data["@graph"] ?? [data])) as Node[];
  });
  const people = nodes.filter((n) => n["@type"] === "Person" && n.name);
  if (!people.length) throw new Error(`${team} answered without schema.org Person nodes`);
  return new Map(people.map((n) => [nameKey(n.name!), n.jobTitle ?? ""]));
}

let cached: ReturnType<typeof load> | undefined;
/** Fetched once per process: the dev server renders the overview on every request. An unreachable
 *  or failing page is asked again on the next request, so a dev server started offline recovers. */
export const roster = () =>
  (cached ??= load().then(
    (r) => {
      if (!r) cached = undefined;
      return r;
    },
    (e) => {
      cached = undefined;
      throw e;
    },
  ));
