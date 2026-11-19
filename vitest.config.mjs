import base from "@hackersandwizards/scaffolding/vitest";
import { mergeConfig } from "vitest/config";

export default mergeConfig(base, {
  test: {
    exclude: ["src/content/**"],
    // Run the export script with Bun's native import.meta.dir.
    server: { deps: { external: [/\/scripts\/export\.ts$/] } },
  },
});
