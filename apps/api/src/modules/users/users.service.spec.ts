import { Test, type TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  it("is resolved through Nest's DI container (proves decorator metadata is emitted)", () => {
    expect(service).toBeInstanceOf(UsersService);
  });

  it("lists seeded users", () => {
    expect(service.findAll().length).toBeGreaterThanOrEqual(2);
  });

  it("creates a new user", () => {
    const user = service.create({ name: "Grace Hopper", email: "grace@example.com" });
    expect(user).toMatchObject({ name: "Grace Hopper", email: "grace@example.com" });
    expect(service.findAll()).toContainEqual(user);
  });
});
