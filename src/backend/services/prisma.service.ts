import { Injectable, Logger } from "@nestjs/common";
import { prisma } from "../../../prisma/client.ts";
import { PrismaClient } from "./../../../prisma/client.ts";

@Injectable()
export class PrismaService {
  private readonly logger: Logger;
  prisma: PrismaClient;
  constructor() {
    this.logger = new Logger(PrismaService.name);
    this.logger.log("PrismaService instantiated");
    this.prisma = prisma;
  }

  async getJoinedDeposits() {
    const deposits = await this.prisma.deposits.findMany({
      take: 10,
      include: {
        dep,
      },
    });
    console.log(deposits);
    return deposits;
  }
}
