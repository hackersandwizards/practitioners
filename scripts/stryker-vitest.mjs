// Stryker starts under Node, but its Vitest runner and tests need Bun.
if (!process.versions.bun) process.execPath = "bun";

// Babel's stack trace hook breaks Vite's Error.captureStackTrace calls under Bun.
const prepareStackTrace = Error.prepareStackTrace;
if (process.versions.bun) delete Error.prepareStackTrace;
const runner = await import("@stryker-mutator/vitest-runner").finally(() => {
  Error.prepareStackTrace = prepareStackTrace;
});

export const { strykerPlugins, strykerValidationSchema } = runner;
