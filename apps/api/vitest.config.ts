import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.e2e-spec.ts"],
  },
  plugins: [
    // Required to build the test files with SWC (emits decorator metadata for DI)
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
