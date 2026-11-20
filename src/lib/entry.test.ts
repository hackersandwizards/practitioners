import { expect, test, vi } from "vitest";
import { affiliation, bareName, links, missing, shown } from "./entry";

vi.hoisted(() => {
  vi.stubEnv("DEV", false);
  vi.stubEnv("PREVIEW", undefined);
});
vi.unstubAllEnvs();

const draft = { name: "Ada Example", status: "draft" } as const;

test("profile links stay in display order and use readable labels for extra sites", () => {
  const profiles = {
    ...draft,
    linkedin: "https://www.linkedin.com/in/ada",
    website: "https://www.example.com/about",
    github: "https://github.com/ada",
    bluesky: "https://bsky.app/profile/ada.example",
    x: "https://x.com/ada",
    threads: "https://threads.net/@ada",
    mastodon: "https://mastodon.social/@ada",
    profiles: ["https://www.speakerdeck.com/ada", "https://sub.www.example.com/ada"],
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
    { label: "speakerdeck.com", href: profiles.profiles[0] },
    { label: "sub.www.example.com", href: profiles.profiles[1] },
    { label: "Book a call", href: profiles.bookme },
  ]);
  expect(links(draft)).toEqual([]);
});

test("an explicit affiliation wins and only staff and freelance entries have defaults", () => {
  expect(affiliation({ ...draft, affiliation: "Example Labs", relation: "staff" })).toBe(
    "Example Labs",
  );
  expect(affiliation({ ...draft, relation: "staff" })).toBe("hackers&wizards");
  expect(affiliation({ ...draft, relation: "freelance" })).toBe("freelance");
  expect(affiliation({ ...draft, relation: "guest" })).toBeUndefined();
  expect(affiliation(draft)).toBeUndefined();
});

test("the first name follows a leading doctorate title", () => {
  expect(bareName("Dr.  Ada Example")).toBe("Ada Example");
  expect(bareName("Ada Dr. Example")).toBe("Ada Dr. Example");
  expect(bareName("Dr.ada")).toBe("Dr.ada");
});

test("the missing fields distinguish blank or seed bios from content the person supplied", () => {
  expect(missing({ id: "ada", data: {} }, undefined)).toEqual([
    "English bio",
    "German bio",
    "LinkedIn",
    "Portrait",
  ]);

  const data = { linkedin: "https://www.linkedin.com/in/ada", photo: "./photo.webp" };
  expect(missing({ id: "ada", data, body: "  " }, " \n ")).toEqual(["English bio", "German bio"]);
  expect(missing({ id: "ada", data, body: "Seed draft for review." }, "Ada trainiert.")).toEqual([
    "English bio",
  ]);
  expect(missing({ id: "ada", data, body: "Ada trains." }, "Ada trainiert.")).toEqual([]);
  expect(
    missing({ id: "reachy", data: { photo: "./photo.webp" }, body: "Hello." }, "Hallo."),
  ).toEqual([]);
});

test("the public build shows active profiles only", () => {
  expect(shown(draft)).toBe(false);
  expect(shown({ ...draft, status: "active" })).toBe(true);
});
