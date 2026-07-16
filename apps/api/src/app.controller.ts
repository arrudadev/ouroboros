import { Controller, Get } from "@nestjs/common";
// Value import: constructor-injected, Nest's DI needs the runtime class reference.
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
