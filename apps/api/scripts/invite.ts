import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { auth } from "../src/shared/auth/auth";

export function generatePassword(): string {
  return randomBytes(20).toString("base64url");
}

export type InviteInput = {
  email: string;
  name: string;
  password?: string;
};

export type InviteResult =
  | { ok: true; email: string; id: string; generatedPassword: string | null }
  | { ok: false; message: string };

/**
 * Provisions an account through Better Auth's admin server API, bypassing
 * the disabled public sign-up. This is the only way accounts get created:
 * invoked here from the CLI below, and directly from tests/other scripts.
 */
export async function invite(input: InviteInput): Promise<InviteResult> {
  const wasGenerated = !input.password;
  const password = input.password ?? generatePassword();

  try {
    const { user } = await auth.api.createUser({
      body: { name: input.name, email: input.email, password },
    });
    return {
      ok: true,
      email: user.email,
      id: user.id,
      generatedPassword: wasGenerated ? password : null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message };
  }
}

function printUsage() {
  console.error(
    "Usage: pnpm --filter @ouroboros/api invite --email <email> --name <name> [--password <password>]",
  );
}

async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: "string" },
      name: { type: "string" },
      password: { type: "string" },
    },
  });

  if (!values.email || !values.name) {
    console.error("Error: --email and --name are required.\n");
    printUsage();
    process.exit(1);
  }

  const result = await invite({
    email: values.email,
    name: values.name,
    password: values.password,
  });

  if (!result.ok) {
    console.error(`Error: ${result.message}`);
    process.exit(1);
  }

  console.log(`Account created for ${result.email} (id: ${result.id})`);
  if (result.generatedPassword) {
    console.log(`Generated password (share this out of band): ${result.generatedPassword}`);
  }
}

// Only run the CLI when this file is executed directly, not when imported
// (e.g. by tests exercising the `invite` function).
if (require.main === module) {
  main();
}
