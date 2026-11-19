import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...defaultExclude, "src/content/**"],
    testTimeout: Number(process.env.SCAFFOLDING_TEST_TIMEOUT_MS || 5000),
    // Run the export script with Bun's native import.meta.dir.
    server: { deps: { external: [/\/scripts\/export\.ts$/] } },
  },
});
