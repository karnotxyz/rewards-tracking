import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { StatusController } from "./controllers/status.controller";
import { RewardsController } from "./controllers/rewards.controller";
import { LedgerService } from "./services/ledger.service";
import { LSTService } from "./services/lst.service";
import { ConfigService } from "./services/config.service";
import { ReferrerService } from "./services/referrer.service";

@Module({
  providers: [LedgerService, LSTService, ConfigService, ReferrerService],
  controllers: [
    StatusController,
    RewardsController,
  ],
})
class AppModule { }

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}
bootstrap();
