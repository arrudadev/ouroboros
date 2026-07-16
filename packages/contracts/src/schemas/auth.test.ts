import { describe, expect, it } from "vitest";
import { loginSchema } from "./auth";

describe("loginSchema", () => {
  it("accepts a valid email and password", () => {
    expect(
      loginSchema.safeParse({ email: "ada@example.com", password: "password123" }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "password123" }).success).toBe(
      false,
    );
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(loginSchema.safeParse({ email: "ada@example.com", password: "short" }).success).toBe(
      false,
    );
  });
});
