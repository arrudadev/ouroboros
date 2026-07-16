import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { ZodValidationPipe } from "nestjs-zod";
import { UsersModule } from "./modules/users/users.module";
import { auth } from "./shared/auth/auth";

@Module({
  imports: [
    // Installs a global AuthGuard: every route requires a session unless
    // explicitly marked @AllowAnonymous(). Better Auth's own endpoints
    // (sign-in, sign-up, get-session, sign-out) manage their own auth and
    // are never blocked by this guard.
    AuthModule.forRoot({ auth }),
    UsersModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
