import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { host: "127.0.0.1", port: 4325 },
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss() as never] },
});
