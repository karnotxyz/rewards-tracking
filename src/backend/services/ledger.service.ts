import { Injectable, Logger } from "@nestjs/common";
import { deposits, transfer, withdrawals } from "generated/index.d.ts";
import { prisma } from "../../../prisma/client.ts";
import { sortEntries } from "./utils.ts";
import type { PrismaClient, TransactionType } from "generated/index.d.ts";

export type WithDepositEventType = deposits & { eventType?: "deposit" };
export type WithWithdrawalEventType = withdrawals & {
  eventType?: "withdrawal";
};
export type WithTransferEventType = transfer & { eventType?: "transfer" };

@Injectable()
export class LedgerService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
    this.logger = new Logger(LedgerService.name);
    this.logger.log("LedgerService instantiated");
  }

  // First should get the last blcok number from the ledger
  // And continue from there instead of starting from the beginning
  async populateLedger() {
    this.logger.log("Populating ledger...");

    const [lastDeposit, lastWithdrawal, lastTransfer] = await this.prisma
      .$transaction([
        this.prisma.processedState.findUniqueOrThrow({
          where: { type: "DEPOSIT" },
        }),
        this.prisma.processedState.findUniqueOrThrow({
          where: { type: "WITHDRAWAL" },
        }),
        this.prisma.processedState.findUniqueOrThrow({
          where: { type: "TRANSFER" },
        }),
      ]);

    // Add an event type to each deposit, withdrawal, and transfer
    let deposits: Array<WithDepositEventType> = await this.prisma.deposits
      .findMany({
        where: {
          OR: [
            block_number: { gt: lastDeposit.block_number },
          ]
        },
      });
    let withdrawals: Array<WithWithdrawalEventType> = await this.prisma
      .withdrawals
      .findMany();
    let transfers: Array<WithTransferEventType> = await this.prisma
      .transfer.findMany();

    deposits = deposits.map((deposit) => {
      return { ...deposit, eventType: "deposit" };
    });

    withdrawals = withdrawals.map((withdrawal) => {
      return { ...withdrawal, eventType: "withdrawal" };
    });

    transfers = transfers.map((transfer) => {
      return { ...transfer, eventType: "transfer" };
    });

    // merge deposits, withdrawals, and transfers into a single array
    // sort by block number, tx index, and event index
    // iterate over the array and update the ledger
    const updates = sortEntries([...deposits, ...withdrawals, ...transfers]);
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

    let ledgerTransactions = [];
    for (const update of updates) {
      if (update.eventType === "deposit") {
        // Handle deposit event
        const deposit = {
          block_number: update.block_number,
          tx_index: update.tx_index,
          event_index: update.event_index,
          order_index: 0,
          user: update.owner,
          amount: update.shares,
          type: "DEPOSIT" as TransactionType,
          referral_code: update.referrer ?? null,
        };
        ledgerTransactions.push(deposit);
      } else if (update.eventType === "withdrawal") {
        // Handle withdrawal event
      } else if (update.eventType === "transfer") {
        // Handle transfer event
      } else {
        throw new Error("Invalid event type");
      }
    }

    this.prisma.$transaction([
      this.prisma.ledger.createMany({
        data: ledgerTransactions,
      }),

      // Update the processed state
      this.prisma.processedState.upsert({
        create: {
          type: "DEPOSIT",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
        update: {
          block_number: deposits[deposits.length - 1].block_number,
          tx_index: deposits[deposits.length - 1].tx_index,
          event_index: deposits[deposits.length - 1].event_index,
        },
        where: {
          type: "DEPOSIT",
        },
      }),

      this.prisma.processedState.upsert({
        create: {
          type: "WITHDRAWAL",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
        update: {
          block_number: withdrawals[withdrawals.length - 1].block_number,
          tx_index: withdrawals[withdrawals.length - 1].tx_index,
          event_index: withdrawals[withdrawals.length - 1].event_index,
        },
        where: {
          type: "WITHDRAWAL",
        },
      }),

      this.prisma.processedState.upsert({
        create: {
          type: "TRANSFER",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
        update: {
          block_number: transfers[transfers.length - 1].block_number,
          tx_index: transfers[transfers.length - 1].tx_index,
          event_index: transfers[transfers.length - 1].event_index,
        },
        where: {
          type: "TRANSFER",
        },
      }),
    ]);

    console.log("Ledger updated", updates.length, "updates");
  }
}
