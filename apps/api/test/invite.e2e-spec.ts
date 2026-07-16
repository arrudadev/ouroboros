import { randomUUID } from "node:crypto";
import { invite } from "../scripts/invite";
import { auth } from "../src/shared/auth/auth";

describe("invite script", () => {
  it("creates an account with a generated password that can sign in", async () => {
    const email = `invite-generated-${randomUUID()}@example.com`;

    const result = await invite({ email, name: "Generated Password User" });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected invite to succeed");
    expect(result.email).toBe(email);
    expect(result.generatedPassword).toBeTruthy();

    const signIn = await auth.api.signInEmail({
      body: { email, password: result.generatedPassword as string },
    });
    expect(signIn.user.email).toBe(email);
  });

  it("creates an account with an explicit password and does not report one as generated", async () => {
    const email = `invite-explicit-${randomUUID()}@example.com`;

    const result = await invite({
      email,
      name: "Explicit Password User",
      password: "explicit-pass-123",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected invite to succeed");
    expect(result.generatedPassword).toBeNull();

    const signIn = await auth.api.signInEmail({
      body: { email, password: "explicit-pass-123" },
    });
    expect(signIn.user.email).toBe(email);
  });

  it("fails clearly when the email already exists", async () => {
    const email = `invite-duplicate-${randomUUID()}@example.com`;
    await invite({ email, name: "First" });

    const result = await invite({ email, name: "Second" });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected invite to fail");
    expect(result.message).toMatch(/already exists/i);
  });
});
