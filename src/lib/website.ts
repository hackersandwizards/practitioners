/** Who hackersandwizards.dev/team/ shows, with the role it prints under each name, in page order.
 *  The website publishes both as schema.org Person in the page's JSON-LD; reading that published
 *  page keeps the roster the website's own (CLAUDE.md). Undefined when the page is unreachable, so
 *  the overview says it does not know rather than marking everyone as missing. */
export const team = "https://www.hackersandwizards.dev/team/";

type Node = { "@type"?: string; name?: string; jobTitle?: string };

export async function roster(): Promise<Map<string, string> | undefined> {
  try {
    const res = await fetch(team, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return undefined;
    const html = await res.text();
    const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
    const graph: Node[] = json ? (JSON.parse(json)["@graph"] ?? []) : [];
    const people = graph.filter((n) => n["@type"] === "Person" && n.name);
    return people.length ? new Map(people.map((n) => [n.name!, n.jobTitle ?? ""])) : undefined;
  } catch {
    return undefined;
  }
}
