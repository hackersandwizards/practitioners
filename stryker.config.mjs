import base from "@hackersandwizards/scaffolding/stryker";

export default {
  ...base,
  incremental: false,
  mutate: [
    "src/lib/bio-text.ts",
    "src/lib/entry.ts",
    "src/lib/schema.ts",
    "src/lib/website.ts",
    "scripts/export.ts",
    "scripts/pull-request-paths.ts",
    "scripts/retouch-portrait.ts",
  ],
  vitest: { ...base.vitest, pool: "forks" },
};
