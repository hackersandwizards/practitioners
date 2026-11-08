import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { catalog } from "@hackersandwizards/scaffolding/catalog";

// The catalog (/catalog/) shows drafts, so it builds where drafts render: the dev server and the
// gate's preview build (src/lib/entry.ts, `review`). argv[2] is Astro's command.
const review = process.argv[2] === "dev" || process.env.PREVIEW === "1";

export default defineConfig({
  server: { host: "127.0.0.1", port: 4325 },
  devToolbar: { enabled: false },
  integrations: review
    ? [
        catalog({
          product: "Practitioners",
          lead: "Every component of the practitioners hub, each with its variants and states on real entries, then the brand elements the pages use.",
          css: ["./src/styles/global.css"],
          // The home's rail is brand's hw-nav and hw-search, which the pages themselves never load.
          homeCss: ["./src/styles/global.css", "@hackersandwizards/brand/elements.css"],
          head: "./catalog/Head.astro",
          home: "./catalog/Home.astro",
          admin: true,
          serverOnly: true,
          previewStates: ["approved", "many", "filled"],
        }),
      ]
    : [],
  vite: { plugins: [tailwindcss() as never] },
});
