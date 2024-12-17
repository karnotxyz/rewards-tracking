import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { StatusController } from "./controllers/status.controller.ts";
import { PrismaService } from "./services/prisma.service.ts";
import { RewardsController } from "./controllers/rewards.controller.ts";
import { LedgerService } from "./services/ledger.service.ts";

@Module({
  providers: [PrismaService, LedgerService],
  controllers: [
    StatusController,
    RewardsController, // TODO: Remove the rewards controller in production
  ],
})
class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(Deno.env.get("PORT") ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}
bootstrap();
