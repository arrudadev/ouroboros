import { Body, Controller, Get, Post } from "@nestjs/common";
import type { User } from "@ouroboros/contracts";
import { CreateUserDto, type UserDto } from "./user.dto";
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
