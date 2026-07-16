import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { userListSchema } from "@ouroboros/contracts";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";

describe("UsersController (e2e)", () => {
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

  it("GET /users returns a list matching the shared contract", async () => {
    const response = await request(app.getHttpServer()).get("/users").expect(200);

    expect(() => userListSchema.parse(response.body)).not.toThrow();
  });

  it("POST /users creates a user from a valid payload", async () => {
    const response = await request(app.getHttpServer())
      .post("/users")
      .send({ name: "Grace Hopper", email: "grace@example.com" })
      .expect(201);

    expect(response.body).toMatchObject({ name: "Grace Hopper", email: "grace@example.com" });
  });

  it("POST /users rejects an invalid payload with 400 (ZodValidationPipe)", async () => {
    await request(app.getHttpServer())
      .post("/users")
      .send({ name: "", email: "not-an-email" })
      .expect(400);
  });
});
