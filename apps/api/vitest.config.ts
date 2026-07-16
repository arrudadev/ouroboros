import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.e2e-spec.ts"],
    // DB/HTTP-touching logic lives in the e2e suite (test/*.e2e-spec.ts)
    // against an isolated database; this tier only has pure-logic specs and
    // may legitimately be empty.
    passWithNoTests: true,
  },
  plugins: [
    // Required to build the test files with SWC (emits decorator metadata for DI)
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
