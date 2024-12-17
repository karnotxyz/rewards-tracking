import { Injectable, Logger } from "@nestjs/common";
import { prisma } from "../../../prisma/client.ts";
import type { PrismaClient } from "generated/index.d.ts";

@Injectable()
export class PrismaService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;
  constructor() {
    this.logger = new Logger(PrismaService.name);
    this.logger.log("PrismaService instantiated");
    this.prisma = prisma;
  }

  async getDeposits() {
    return await this.prisma.deposits.findMany();
  }

  async getWithdrawals() {
    return await this.prisma.withdrawals.findMany();
  }

  async getTransfers() {
    return await this.prisma.transfer.findMany();
  }
}
