import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma.service.ts";

@Injectable()
export class LedgerService {
  private readonly logger: Logger;
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.logger = new Logger(LedgerService.name);
    this.prisma = prisma;
    this.logger.log("LedgerService instantiated");
  }

  // async getLedger() {
  //   this.logger.log("Getting ledger...");
  //   const ledger = await this.prisma.getLedger();
  //   this.logger.log("Ledger: ", ledger);
  //   return ledger;
  // }

  // First should get the last blcok number from the ledger
  // And continue from there instead of starting from the beginning
  async populateLedger() {
    this.logger.log("Populating ledger...");
    const deposits = await this.prisma.getDeposits();
    const withdrawals = await this.prisma.getWithdrawals();
    const transfers = await this.prisma.getTransfers();

    // merge deposits, withdrawals, and transfers into a single array
    // sort by block number, tx index, and event index
    // iterate over the array and update the ledger
    const updates = [...deposits, ...withdrawals, ...transfers].sort((a, b) => {
      if (a.block_number !== b.block_number) {
        return a.block_number - b.block_number;
      }
      if (a.tx_index !== b.tx_index) {
        return a.tx_index - b.tx_index;
      }
      return a.event_index - b.event_index;
    });

    console.log("Updates: sorted by block number, tx index, and event index");

    for (let i = 1; i < updates.length; i++) {
      const update = updates[i];
      const previous = updates[i - 1];
      if (
        update.block_number < previous.block_number &&
        update.tx_index < previous.tx_index &&
        update.event_index < previous.event_index
      ) {
        throw new Error("Invalid update order");
      }
    }

    

    console.log("Ledger updated", updates.length, "updates");
  }
}
