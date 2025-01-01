import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";

import { StatusController } from "./controllers/status.controller";
import { RewardsController } from "./controllers/rewards.controller";
import { LedgerService } from "./services/ledger.service";
import { LSTService } from "./services/lst.service";
import { ConfigService } from "./services/config.service";
import { ReferrerService } from "./services/referrer.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as dotenv from "dotenv";
import { PrismaService } from "./services/prisma.service";

@Module({
  providers: [LedgerService, PrismaService, LSTService, ConfigService, ReferrerService],
  controllers: [
    StatusController,
    RewardsController,
  ],
})
export class AppModule { }

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
      .setTitle('Rewards Tracking')
      .setDescription('This is the rewards tracking application for xStrk LST rewards')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);


    const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
    dotenv.config({ path: envPath, override: true });
    console.log("Environment variables loaded from: ", envPath);
    console.log("db url", process.env.DATABASE_URL);


    await app.listen(process.env.PORT ?? 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}
bootstrap();
