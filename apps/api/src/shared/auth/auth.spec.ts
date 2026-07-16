import { auth } from "./auth";

describe("auth", () => {
  it("initializes without throwing and exposes the request handler", () => {
    expect(auth.handler).toBeTypeOf("function");
  });

  it("exposes the email/password sign-in API", () => {
    expect(auth.api.signInEmail).toBeTypeOf("function");
  });

  it("rejects sign-up because disableSignUp is enabled", async () => {
    await expect(
      auth.api.signUpEmail({
        body: { name: "Should Fail", email: "blocked@example.com", password: "password123" },
      }),
    ).rejects.toThrow();
  });

  it("exposes the admin plugin's server-side createUser API (used by the invite script)", () => {
    expect(auth.api.createUser).toBeTypeOf("function");
  });
});
