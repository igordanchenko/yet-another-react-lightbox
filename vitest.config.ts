/* eslint-disable import/no-extraneous-dependencies,import/extensions */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    dir: "test/unit",
    environment: "jsdom",
    coverage: { include: ["src"] },
    setupFiles: "./test/unit/setup.ts",
  },
});
