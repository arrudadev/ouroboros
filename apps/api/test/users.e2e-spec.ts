import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { userListSchema, userSchema } from "@ouroboros/contracts";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { createAuthenticatedAgent, type SeededUser } from "./support/authenticated-agent";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let agent: Awaited<ReturnType<typeof createAuthenticatedAgent>>["agent"];
  let user: SeededUser;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    ({ agent, user } = await createAuthenticatedAgent(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /users without a session is rejected by the global AuthGuard", async () => {
    await request(app.getHttpServer()).get("/users").expect(401);
  });

  it("GET /users/me without a session is rejected by the global AuthGuard", async () => {
    await request(app.getHttpServer()).get("/users/me").expect(401);
  });

  it("GET /users with a session returns real accounts from the database, matching the shared contract", async () => {
    const response = await agent.get("/users").expect(200);

    const users = userListSchema.parse(response.body);
    expect(users).toContainEqual(expect.objectContaining({ name: user.name, email: user.email }));
  });

  it("GET /users/me with a session returns the signed-in user", async () => {
    const response = await agent.get("/users/me").expect(200);

    const me = userSchema.parse(response.body);
    expect(me).toMatchObject({ name: user.name, email: user.email });
  });

  it("POST /users no longer exists: account creation is invite-only", async () => {
    await agent.post("/users").send({ name: "Nope", email: "nope@example.com" }).expect(404);
  });
});
