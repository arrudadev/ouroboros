import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { TEST_DATABASE_URL } from "./test/support/test-db";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    globalSetup: "./test/support/global-setup.ts",
    // Every e2e file shares the same local libsql file; running them
    // concurrently causes SQLITE_BUSY ("database is locked") errors.
    fileParallelism: false,
    env: {
      // Isolated from the developer's local.db so e2e runs (which create
      // real users via auth.api.createUser) start from a clean slate.
      DATABASE_URL: TEST_DATABASE_URL,
    },
  },
  plugins: [swc.vite()],
});
