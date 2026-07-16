import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Better Auth needs the raw request body; @thallesp/nestjs-better-auth
    // re-adds the default body parsers for every other route.
    bodyParser: false,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
