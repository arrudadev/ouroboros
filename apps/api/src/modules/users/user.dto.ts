import { createUserSchema, userSchema } from "@ouroboros/contracts";
import { createZodDto } from "nestjs-zod";

export class UserDto extends createZodDto(userSchema) {}

export class CreateUserDto extends createZodDto(createUserSchema) {}
