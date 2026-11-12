import { expect, test } from "bun:test";
import { Glob } from "bun";
import { rejection } from "@hackersandwizards/scaffolding/rejection";
import { base } from "../../scripts/export";
import { listing, load, roster, source } from "./website";

const stub = async (respond: () => Promise<Response>, run: () => Promise<void>) => {
  const { fetch: real } = globalThis;
  globalThis.fetch = respond as unknown as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = real;
  }
};

const person = {
  slug: "ada-lovelace",
  name: "Ada King, Countess of Lovelace",
  role: "Analyst",
  description: null,
  url: "https://www.hackersandwizards.dev/team/ada-lovelace/",
  image: "https://www.hackersandwizards.dev/media/portraits/ada-lovelace.webp",
};

test("the roster matches a folder by slug, whatever name the website prints", () =>
  stub(
    async () => Response.json([person, { ...person, slug: "grace", description: "Admiral." }]),
    async () => {
      const web = await load();
      expect(listing(web, "ada-lovelace")).toEqual({
        job: "Analyst",
        description: undefined,
        url: person.url,
        listed: true,
      });
      expect(listing(web, "grace").description).toBe("Admiral.");
      expect(listing(web, "nobody").listed).toBe(false);
    },
  ));

test("a profile link other than https fails the build rather than reading as unknown", () =>
  stub(
    async () => Response.json([{ ...person, url: "javascript:alert(1)" }]),
    async () => {
      expect(await rejection(load())).toContain("another shape");
    },
  ));

test("a page that answers in HTML fails naming the roster", () =>
  stub(
    async () => new Response("<!doctype html>"),
    async () => {
      expect(await rejection(load())).toContain(source);
    },
  ));

// The gate check: the website lists nobody without a folder here. An unreachable website passes, so
// a commit made offline is not held up by it.
test("every slug the website lists has a folder here", async () => {
  const web = await load();
  if (!web) return console.warn(`website.test.ts: the roster was unreachable, not checked`);
  const folders = new Set([...new Glob("*/bio.md").scanSync(base)].map((p) => p.split("/")[0]));
  expect(web.size).toBeGreaterThan(0);
  expect([...web.keys()].filter((slug) => !folders.has(slug))).toEqual([]);
}, 15_000);

test("a build asks an unreachable website once, not once per page", async () => {
  // Bun reads import.meta.env.DEV from the environment; only Astro's dev server sets it.
  const dev = process.env.DEV;
  delete process.env.DEV;
  let calls = 0;
  try {
    await stub(
      async () => {
        calls++;
        throw new Error("unreachable");
      },
      async () => {
        expect(await roster()).toBeUndefined();
        expect(await roster()).toBeUndefined();
        expect(calls).toBe(1);
      },
    );
  } finally {
    if (dev !== undefined) process.env.DEV = dev;
  }
});
