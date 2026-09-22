import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    // `components/**` covers logic that ships beside a component rather
    // than in `lib` — the market-figure resolver and its parsing rules.
    // Both globs are plain `.ts`: this runs in a node environment with no
    // DOM, so component files themselves stay out.
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
