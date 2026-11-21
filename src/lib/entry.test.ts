import { expect, test, vi } from "vitest";
import { affiliation, links, shown } from "./entry";

vi.hoisted(() => {
  vi.stubEnv("DEV", false);
  vi.stubEnv("PREVIEW", undefined);
});
vi.unstubAllEnvs();

const draft = { name: "Ada Example", status: "draft" } as const;

test("named profile links use their display labels and order", () => {
  const profiles = {
    ...draft,
    linkedin: "https://www.linkedin.com/in/ada",
    website: "https://www.example.com/about",
    github: "https://github.com/ada",
    bluesky: "https://bsky.app/profile/ada.example",
    x: "https://x.com/ada",
    threads: "https://threads.net/@ada",
    mastodon: "https://mastodon.social/@ada",
    bookme: "https://cal.com/ada",
  };
  expect(links(profiles)).toEqual([
    { label: "LinkedIn", href: profiles.linkedin },
    { label: "example.com", href: profiles.website },
    { label: "GitHub", href: profiles.github },
    { label: "Bluesky", href: profiles.bluesky },
    { label: "X", href: profiles.x },
    { label: "Threads", href: profiles.threads },
    { label: "Mastodon", href: profiles.mastodon },
    { label: "Book a call", href: profiles.bookme },
  ]);
});

test("only staff and freelance entries have default affiliations", () => {
  expect(affiliation({ ...draft, relation: "staff" })).toBe("hackers&wizards");
  expect(affiliation({ ...draft, relation: "freelance" })).toBe("freelance");
  expect(affiliation({ ...draft, relation: "guest" })).toBeUndefined();
  expect(affiliation({ ...draft, relation: "partner" })).toBeUndefined();
  expect(affiliation(draft)).toBeUndefined();
});

test("the public build shows active profiles only", () => {
  expect(shown(draft)).toBe(false);
  expect(shown({ ...draft, status: "active" })).toBe(true);
});
