import { Body, Controller, Get, Post } from "@nestjs/common";
import type { User } from "@ouroboros/contracts";
// CreateUserDto must stay a value import: Nest's emitDecoratorMetadata puts the class itself
// in `design:paramtypes`, which nestjs-zod reads at runtime to find the attached Zod schema.
import { CreateUserDto, type UserDto } from "./user.dto";
// UsersService must stay a value import too: it's the runtime reference Nest's DI container
// resolves the constructor parameter against.
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: CreateUserDto): UserDto {
    return this.usersService.create(body);
  }
}
