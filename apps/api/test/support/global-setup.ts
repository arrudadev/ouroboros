import { existsSync, unlinkSync } from "node:fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { TEST_DATABASE_FILE, TEST_DATABASE_URL } from "./test-db";

function removeIfExists(path: string) {
  if (existsSync(path)) unlinkSync(path);
}

// Runs once before the e2e suite: gives every run a clean, migrated database
// instead of accumulating test users in the developer's local.db.
export default async function setup() {
  for (const suffix of ["", "-wal", "-shm"]) {
    removeIfExists(`${TEST_DATABASE_FILE}${suffix}`);
  }

  const client = createClient({ url: TEST_DATABASE_URL });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "./drizzle" });
  client.close();
}
