import type { CollectionEntry } from "astro:content";

type Data = CollectionEntry<"practitioners">["data"];

const host = (href: string) => new URL(href).host.replace(/^www\./, "");

/** Only the profiles a practitioner actually maintains render; a dead link is worse than none. */
export const links = (d: Data) =>
  [
    { label: "LinkedIn", href: d.linkedin },
    { label: d.website && host(d.website), href: d.website },
    { label: "GitHub", href: d.github },
    { label: "Bluesky", href: d.bluesky },
    { label: "X", href: d.x },
    { label: "Threads", href: d.threads },
    { label: "Mastodon", href: d.mastodon },
    ...(d.profiles ?? []).map((href) => ({ label: host(href), href })),
    { label: "Book a call", href: d.bookme },
  ].filter((l): l is { label: string; href: string } => Boolean(l.href));

/** What the practitioner-bio skill's mandatory list still lacks. A seed text is one h&w wrote,
 *  so it does not count as the person's bio. */
export const missing = (entry: CollectionEntry<"practitioners">, german: string | undefined) =>
  [
    (!entry.body?.trim() || entry.body.includes("Seed draft")) && "English bio",
    !german?.trim() && "German bio",
    !entry.data.linkedin && "LinkedIn",
  ].filter((m): m is string => Boolean(m));

/** A build that could go public carries only `active` entries, the ones their person approved.
 *  Drafts and seeds show in the dev server and in the gate's preview build (PREVIEW=1, into
 *  .preview/), which renders
 *  every page so a broken one fails the gate. */
export const shown = (d: Data) =>
  import.meta.env.DEV || process.env.PREVIEW === "1" || d.status === "active";
