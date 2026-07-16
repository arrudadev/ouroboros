import { Controller, Get } from "@nestjs/common";
import type { User } from "@ouroboros/contracts";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { auth } from "../../shared/auth/auth";
// UsersService must stay a value import: it's the runtime reference Nest's DI
// container resolves the constructor parameter against.
import { toUserDto, UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get("me")
  me(@Session() session: UserSession<typeof auth>): User {
    return toUserDto(session.user);
  }
}
