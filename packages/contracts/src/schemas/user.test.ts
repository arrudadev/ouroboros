import { describe, expect, it } from "vitest";
import { createUserSchema, userSchema } from "./user";

describe("userSchema", () => {
  it("accepts a valid user", () => {
    const result = userSchema.safeParse({
      id: "8d5a2b1e-2f3a-4a9e-9c0e-6f1b2c3d4e5f",
      name: "Ada Lovelace",
      email: "ada@example.com",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = userSchema.safeParse({
      id: "8d5a2b1e-2f3a-4a9e-9c0e-6f1b2c3d4e5f",
      name: "Ada Lovelace",
      email: "not-an-email",
      createdAt: "2026-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});

describe("createUserSchema", () => {
  it("omits id and createdAt", () => {
    expect(createUserSchema.safeParse({ name: "Ada", email: "ada@example.com" }).success).toBe(
      true,
    );
  });
});
