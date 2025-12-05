import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    dir: "test/unit",
    environment: "jsdom",
    setupFiles: "./test/unit/setup.ts",
    coverage: {
      enabled: true,
      include: ["src/**/**.{ts,tsx}"],
      exclude: ["src/**/index.ts", "src/types.ts"],
    },
    testTimeout: 30_000,
  },
});
