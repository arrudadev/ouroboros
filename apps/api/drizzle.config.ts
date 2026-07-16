import { defineConfig } from "drizzle-kit";
import { env } from "./src/shared/config/env";

export default defineConfig({
  dialect: "turso",
  schema: "./src/shared/database/schema",
  out: "./drizzle",
  dbCredentials: env.DATABASE_AUTH_TOKEN
    ? { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN }
    : { url: env.DATABASE_URL },
});
