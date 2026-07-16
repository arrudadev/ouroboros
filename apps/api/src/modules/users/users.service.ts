import { Injectable } from "@nestjs/common";
import type { User } from "@ouroboros/contracts";
import { db } from "../../shared/database/client";
import { user as userTable } from "../../shared/database/schema/auth.schema";

type UserRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    const rows = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        createdAt: userTable.createdAt,
      })
      .from(userTable);

    return rows.map(toUserDto);
  }
}

export function toUserDto(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.createdAt.toISOString() };
}
