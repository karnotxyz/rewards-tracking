import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "./config.service.ts";
import { Contract } from "npm:starknet";
import { ABI as LSTAbi } from "../abis/LST.ts";
import { getAddresses } from "./constants.ts";
import { getNetwork } from "./utils.ts";
import { ExchangeRate, PrismaClient } from "generated/index.d.ts";
import { prisma } from "prisma/client.ts";
import { Decimal } from "@prisma/client/runtime/library";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class LSTService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;
  readonly LST: Contract;

  constructor(private readonly config: ConfigService) {
    this.prisma = prisma;
    this.logger = new Logger(LSTService.name);

    // initialize the LST contract
    this.LST = new Contract(
      LSTAbi,
      getAddresses(getNetwork()).LST,
      config.get("account"),
    ).typedv2(LSTAbi);
  }

  async getRequiredExchangRates() {
    // Get last entry of the exchange rate
    const lastExchangeRate = await this.prisma.exchangeRate.findFirst({
      orderBy: {
        block_number: "desc",
      },
    });

    this.logger.log("Getting exchange rates at each ledger entry");
    const ledgerEntries = await this.prisma.ledger.groupBy({
      by: ["block_number"],
      where: {
        block_number: {
          // If the lastExchangeRate is undefined/null, we return all the ledger entries
          gt: lastExchangeRate?.block_number,
        },
      },
      orderBy: {
        block_number: "asc",
      },
    });

    let exchangeRates: ExchangeRate[] = [];

    for (const entry of ledgerEntries) {
      const rate = await this.exchangeRateAt(entry.block_number);
      console.log("Exchange rate at block number", entry.block_number, rate);
      exchangeRates.push({
        block_number: entry.block_number,
        rate,
      });
      if (exchangeRates.length % 10 === 0) {
        await sleep(2000);
      }

      if (exchangeRates.length % 100 === 0) {
        await this.prisma.exchangeRate.createMany({
          data: exchangeRates,
        });
        exchangeRates = [];
      }
    }

    await this.prisma.exchangeRate.createMany({
      data: exchangeRates,
    });
  }

  async exchangeRateAt(blockNumber: number): Promise<Decimal> {
    const totalAssets = await this.LST.call("total_assets", [], {
      blockIdentifier: blockNumber,
    });
    const totalSupply = await this.LST.call("total_supply", [], {
      blockIdentifier: blockNumber,
    });
    return new Decimal(totalAssets.toString()).div(
      new Decimal(totalSupply.toString()),
    );
  }
}
