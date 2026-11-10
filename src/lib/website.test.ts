import { expect, test } from "bun:test";
import { roster } from "./website";

test("a build asks an unreachable website once, not once per page", async () => {
  const real = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls++;
    throw new Error("unreachable");
  }) as unknown as typeof fetch;
  try {
    expect(await roster()).toBeUndefined();
    expect(await roster()).toBeUndefined();
    expect(calls).toBe(1);
  } finally {
    globalThis.fetch = real;
  }
});
