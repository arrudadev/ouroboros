import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { CreateUser, User } from "@ouroboros/contracts";

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: randomUUID(),
      name: "Ada Lovelace",
      email: "ada@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      name: "Alan Turing",
      email: "alan@example.com",
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  create(input: CreateUser): User {
    const user: User = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.users.push(user);
    return user;
  }
}
