import base from "@hackersandwizards/scaffolding/stryker";

export default {
  ...base,
  mutate: [
    "src/lib/*.ts",
    "!src/lib/*.test.ts",
    "scripts/{export,pull-request,retouch-portrait}.ts",
  ],
  plugins: ["./scripts/stryker-vitest.mjs"],
};
