import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { auth } from "../src/shared/auth/auth";
import { createAuthenticatedAgent } from "./support/authenticated-agent";

describe("Auth (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("sign-up over HTTP is rejected because the account is invite-only", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/sign-up/email")
      .send({ name: "Nope", email: "should-not-exist@example.com", password: "password123" })
      .expect(400);
  });

  it("sign-in with an account provisioned server-side (as the invite script does) succeeds", async () => {
    await auth.api.createUser({
      body: { name: "Sign In User", email: "sign-in@example.com", password: "password123" },
    });

    await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({ email: "sign-in@example.com", password: "password123" })
      .expect(200);
  });

  it("sign-in with the wrong password is rejected", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .send({ email: "sign-in@example.com", password: "wrong-password" })
      .expect(401);
  });

  it("get-session reflects the signed-in user once a session cookie is set", async () => {
    const { agent, user } = await createAuthenticatedAgent(app);

    const response = await agent.get("/api/auth/get-session").expect(200);

    expect(response.body.user).toMatchObject({ email: user.email, name: user.name });
  });

  it("sign-out clears the session, so a protected route rejects the same agent afterwards", async () => {
    const { agent } = await createAuthenticatedAgent(app);

    await agent.get("/users").expect(200);
    await agent.post("/api/auth/sign-out").expect(200);
    await agent.get("/users").expect(401);
  });
});
