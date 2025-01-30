import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    dir: "test/unit",
    environment: "jsdom",
    coverage: {
      all: true,
      enabled: true,
      include: ["src"],
      reporter: [
        ["text", { skipEmpty: true }],
        ["html", { skipEmpty: true }],
      ],
    },
    setupFiles: "./test/unit/setup.ts",
  },
});
