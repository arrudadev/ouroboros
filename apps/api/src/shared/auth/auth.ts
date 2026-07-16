import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { env } from "../config/env";
import { db } from "../database/client";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_ORIGIN],
  emailAndPassword: {
    enabled: true,
    // No public sign-up: accounts are provisioned only via the invite script,
    // which calls auth.api.createUser directly (bypasses this restriction).
    disableSignUp: true,
  },
  plugins: [admin()],
});
