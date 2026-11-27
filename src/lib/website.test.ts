import { assert, expect, test, vi } from "vitest";
import { Glob } from "bun";
import { rejection } from "@hackersandwizards/scaffolding/rejection";
import { base } from "../../scripts/export";
import { load, roster, source } from "./website";

const gateTimeoutFactor = Number(process.env.SCAFFOLDING_TEST_TIMEOUT_MS || 5000) / 5000;

const stub = async (respond: () => Promise<Response>, run: () => Promise<void>) => {
  vi.stubGlobal("fetch", respond);
  try {
    await run();
  } finally {
    vi.unstubAllGlobals();
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

test("the roster response is keyed by slug and normalizes a null description", () =>
  stub(
    async () => Response.json([person, { ...person, slug: "grace", description: "Admiral." }]),
    async () => {
      const web = await load();
      expect(web?.get("ada-lovelace")).toEqual({
        slug: "ada-lovelace",
        role: "Analyst",
        description: undefined,
        url: person.url,
      });
      expect(web?.get("grace")?.description).toBe("Admiral.");
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
      expect(await rejection(load())).toBe(`Error: ${source} did not answer in JSON`);
    },
  ));

test.each([404, 410])("HTTP %i rejects even a valid roster body", (status) =>
  stub(
    async () => Response.json([person], { status }),
    async () => {
      expect(await rejection(load())).toBe(`Error: ${source} returned HTTP ${status}`);
    },
  ),
);

test("a roster that is gone fails the build, an outage reads as unknown", async () => {
  await stub(
    async () => new Response("Not found", { status: 404 }),
    async () => {
      expect(await rejection(load())).toContain(source);
    },
  );
  await stub(
    async () => new Response("", { status: 503 }),
    async () => {
      expect(await load()).toBeUndefined();
    },
  );
});

test.each([
  ["network TypeError", new TypeError("Failed to fetch")],
  ["timeout DOMException", new DOMException("The operation timed out.", "TimeoutError")],
])("a roster fetch failing with %s reads as unknown", (_label, error) =>
  stub(
    async () => {
      throw error;
    },
    async () => {
      expect(await load()).toBeUndefined();
    },
  ),
);

test.each([
  ["generic Error", new Error("unexpected fetch failure")],
  ["non-timeout DOMException", new DOMException("aborted", "InvalidStateError")],
])("a roster fetch failing with %s propagates rather than reading as unknown", (_label, error) =>
  stub(
    async () => {
      throw error;
    },
    async () => {
      expect(await rejection(load())).toBe(String(error));
    },
  ),
);

// Skip the roster check when the website is unreachable so offline commits can proceed.
test(
  "every slug the website lists has a folder here",
  async ({ skip }) => {
    const web = await load();
    skip(!web, "website.test.ts: the roster was unreachable, not checked");
    assert(web, "the website roster should be available after the skip check");
    const folders = new Set([...new Glob("*/bio.md").scanSync(base)].map((p) => p.split("/")[0]));
    expect(web.size).toBeGreaterThan(0);
    expect([...web.keys()].filter((slug) => !folders.has(slug))).toEqual([]);
  },
  15_000 * gateTimeoutFactor,
);

test("the dev server retries a malformed or unreachable roster on the next request", async () => {
  vi.stubEnv("DEV", true);
  const fetch = vi
    .fn<() => Promise<Response>>()
    .mockResolvedValueOnce(new Response("<!doctype html>"))
    .mockRejectedValueOnce(new TypeError("unreachable"))
    .mockResolvedValueOnce(Response.json([person]));
  try {
    await stub(fetch, async () => {
      expect(await rejection(roster())).toContain(source);
      expect(await roster()).toBeUndefined();
      expect((await roster())?.has(person.slug)).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  } finally {
    vi.unstubAllEnvs();
    vi.resetModules();
  }
});

test("a build asks an unreachable website once, not once per page", async () => {
  const { roster } = await import("./website");
  vi.stubEnv("DEV", false);
  let calls = 0;
  try {
    await stub(
      async () => {
        calls++;
        throw new TypeError("unreachable");
      },
      async () => {
        expect(await roster()).toBeUndefined();
        expect(await roster()).toBeUndefined();
        expect(calls).toBe(1);
      },
    );
  } finally {
    vi.unstubAllEnvs();
  }
});
