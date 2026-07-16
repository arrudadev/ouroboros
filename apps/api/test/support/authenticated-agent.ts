import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { auth } from "../../src/shared/auth/auth";

export type SeededUser = {
  name: string;
  email: string;
  password: string;
};

export type AuthenticatedAgent = {
  agent: ReturnType<typeof supertest.agent>;
  user: SeededUser;
};

/**
 * Seeds a fresh user directly through Better Auth's server API (the same
 * call the invite script uses) and signs in over HTTP, returning a supertest
 * agent that carries the resulting session cookie on every subsequent
 * request. Each call uses a unique email so tests can call this freely
 * without colliding on the table's unique constraint.
 */
export async function createAuthenticatedAgent(
  app: INestApplication,
  overrides: Partial<SeededUser> = {},
): Promise<AuthenticatedAgent> {
  const user: SeededUser = {
    name: "E2E User",
    email: `e2e-${randomUUID()}@example.com`,
    password: "password123",
    ...overrides,
  };

  await auth.api.createUser({ body: user });

  const agent = supertest.agent(app.getHttpServer());
  await agent
    .post("/api/auth/sign-in/email")
    .send({ email: user.email, password: user.password })
    .expect(200);

  return { agent, user };
}
