import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_AUTH_TOKEN: z
    .string()
    .optional()
    .transform((value) => value || undefined),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  WEB_ORIGIN: z.url(),
});

// Parsed once at import time so both the Nest app and standalone scripts
// (e.g. the invite script, drizzle-kit config) share the same validated env.
export const env = envSchema.parse(process.env);
