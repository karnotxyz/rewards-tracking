import { Injectable, Logger } from "@nestjs/common";
import { deposits, transfer, withdrawals } from "generated/index.d.ts";
import { prisma } from "prisma/client.ts";
import { sortEntries } from "./utils.ts";
import { assert } from "@std/assert";
import type {
  Ledger,
  PrismaClient,
  TransactionType,
} from "generated/index.d.ts";

// The types of the prisma should be imported this way
// While the type of the prisma schema models will come from the generated files
import { Decimal } from "@prisma/client/runtime/library";

export type WithDepositEventType = deposits & { eventType?: "deposit" };
export type WithWithdrawalEventType = withdrawals & {
  eventType?: "withdrawal";
};
export type WithTransferEventType = transfer & { eventType?: "transfer" };
type LedgerWithOptionalId = Omit<Ledger, "id"> & Partial<Pick<Ledger, "id">>;

@Injectable()
export class LedgerService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
    this.logger = new Logger(LedgerService.name);
    this.logger.log("LedgerService instantiated");
    Decimal.set({ precision: 30, rounding: Decimal.ROUND_DOWN });
  }

  // First should get the last blcok number from the ledger
  // And continue from there instead of starting from the beginning
  async populateLedger() {
    this.logger.log("Populating ledger...");

    // Get the checkpoints from the processed state table
    let [lastDeposit, lastWithdrawal, lastTransfer] = await this.prisma
      .$transaction([
        this.prisma.processedState.findUnique({
          where: { type: "DEPOSIT" },
        }),
        this.prisma.processedState.findUnique({
          where: { type: "WITHDRAWAL" },
        }),
        this.prisma.processedState.findUnique({
          where: { type: "TRANSFER" },
        }),
      ]);

    if (!lastDeposit) {
      this.logger.log("No deposit checkpoint found");
      lastDeposit = {
        type: "DEPOSIT",
        block_number: 0,
        tx_index: 0,
        event_index: 0,
      };

      this.logger.log("Creating deposit checkpoint");
      await this.prisma.processedState.create({
        data: {
          type: "DEPOSIT",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
      });
      this.logger.log("Deposit checkpoint created");
    }

    if (!lastWithdrawal) {
      this.logger.log("No withdrawal checkpoint found");
      lastWithdrawal = {
        type: "WITHDRAWAL",
        block_number: 0,
        tx_index: 0,
        event_index: 0,
      };

      this.logger.log("Creating withdrawal checkpoint");
      await this.prisma.processedState.create({
        data: {
          type: "WITHDRAWAL",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
      });

      this.logger.log("Withdrawal checkpoint created");
    }

    if (!lastTransfer) {
      this.logger.log("No transfer checkpoint found");
      lastTransfer = {
        type: "TRANSFER",
        block_number: 0,
        tx_index: 0,
        event_index: 0,
      };

      this.logger.log("Creating transfer checkpoint");

      await this.prisma.processedState.create({
        data: {
          type: "TRANSFER",
          block_number: 0,
          tx_index: 0,
          event_index: 0,
        },
      });

      this.logger.log("Transfer checkpoint created");
    }

    this.logger.log(lastDeposit, lastWithdrawal, lastTransfer);

    let deposits: Array<WithDepositEventType> = await this.prisma.deposits
      .findMany({
        where: {
          OR: [
            {
              block_number: {
                gt: lastDeposit.block_number,
              },
            },
            {
              AND: [
                {
                  block_number: lastDeposit.block_number,
                },
                {
                  OR: [
                    {
                      tx_index: {
                        gt: lastDeposit.tx_index,
                      },
                    },
                    {
                      AND: [
                        {
                          tx_index: lastDeposit.tx_index,
                        },
                        {
                          event_index: {
                            gt: lastDeposit.event_index,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

    let withdrawals: Array<WithWithdrawalEventType> = await this.prisma
      .withdrawals.findMany({
        where: {
          OR: [
            {
              block_number: {
                gt: lastWithdrawal.block_number,
              },
            },
            {
              AND: [
                {
                  block_number: lastWithdrawal.block_number,
                },
                {
                  OR: [
                    {
                      tx_index: {
                        gt: lastWithdrawal.tx_index,
                      },
                    },
                    {
                      AND: [
                        {
                          tx_index: lastWithdrawal.tx_index,
                        },
                        {
                          event_index: {
                            gt: lastWithdrawal.event_index,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

    let transfers: Array<WithTransferEventType> = await this.prisma.transfer
      .findMany({
        where: {
          OR: [
            {
              block_number: {
                gt: lastTransfer.block_number,
              },
            },
            {
              AND: [
                {
                  block_number: lastTransfer.block_number,
                },
                {
                  OR: [
                    {
                      tx_index: {
                        gt: lastTransfer.tx_index,
                      },
                    },
                    {
                      AND: [
                        {
                          tx_index: lastTransfer.tx_index,
                        },
                        {
                          event_index: {
                            gt: lastTransfer.event_index,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

    // Add an event type to each deposit, withdrawal, and transfer
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

    let currentLedgerTransactions = await this.prisma.ledger.findMany({});

    // sort them in order
    currentLedgerTransactions = currentLedgerTransactions.sort((a, b) => {
      if (a.block_number !== b.block_number) {
        return a.block_number - b.block_number;
      } else if (a.tx_index !== b.tx_index) {
        return a.tx_index - b.tx_index;
      } else if (a.event_index !== b.event_index) {
        return a.event_index - b.event_index;
      } else {
        return a.order_index - b.order_index;
      }
    });

    this.logger.log(
      "Current ledger transactions",
      currentLedgerTransactions.length,
      "updates",
      updates.length,
      "deposits",
      deposits.length,
      "withdrawals",
      withdrawals.length,
      "transfers",
      transfers.length,
    );

    const newLedgerTransactions: LedgerWithOptionalId[] = [];
    for (const update of updates) {
      if (
        update.eventType === "withdrawal" || update.eventType === "transfer"
      ) {
        this.logger.log(
          `Starting ${update.eventType} update for 🆕🆕🆕`,
          update.block_number,
          update.tx_index,
          update.event_index,
        );

        this.logger.log(
          "newLedgerTransactions",
          newLedgerTransactions.length,
          newLedgerTransactions[newLedgerTransactions.length - 1],
        );
      }

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
        newLedgerTransactions.push(deposit);
      } else if (
        update.eventType === "withdrawal" || update.eventType === "transfer"
      ) {
        let owner;
        if (update.eventType === "withdrawal") {
          owner = update.owner;
        } else if (update.eventType === "transfer") {
          owner = update.from;
        } else {
          this.logger.error("Invalid event type");
          throw new Error("Invalid event type");
        }

        // This is the sum of the withdrawals that have been added to ledger already
        const withradrawalSum = currentLedgerTransactions.reduce(
          (acc, curr) => {
            if (curr.type === "WITHDRAWAL" && curr.user === owner) {
              acc = acc.plus(curr.amount);
            }
            return acc;
          },
          new Decimal(0),
        );

        // Add withdrawals of the user that are going to be processed in this run
        let totalWithdrawals = newLedgerTransactions.reduce(
          (acc, curr) => {
            if (curr.type == "WITHDRAWAL" && curr.user === owner) {
              acc = acc.plus(curr.amount);
            }
            return acc;
          },
          new Decimal(withradrawalSum),
        );

        this.logger.log(
          "Total withdrawals",
          totalWithdrawals.toString(),
        );

        const user_processed_deposits: Ledger[] = currentLedgerTransactions
          .filter((
            entry,
          ) => entry.type == "DEPOSIT" && entry.user === owner);
        const current_unprocessed_deposits: LedgerWithOptionalId[] =
          newLedgerTransactions.filter((
            entry,
          ) => entry.type == "DEPOSIT" && entry.user === owner);

        const all_deposits = [
          ...user_processed_deposits,
          ...current_unprocessed_deposits,
        ];

        if (update.eventType === "transfer") {
          this.logger.log("Transfer value", update.value);
          this.logger.log(
            "Total deposits value",
            all_deposits.reduce((acc, curr) => {
              acc = acc.plus(curr.amount);
              return acc;
            }, new Decimal(0)),
          );
        }

        let matched_status = {
          index: -1,
          partial_remaining: new Decimal(0),
        };
        for (let i = 0; i < all_deposits.length; i++) {
          const deposit = all_deposits[i];
          if (!deposit.amount) {
            throw Error(
              "Amount not present in deposit transaction",
            );
          }

          if (deposit.amount.gte(totalWithdrawals)) {
            matched_status = {
              index: i,
              partial_remaining: deposit.amount.minus(totalWithdrawals),
            };

            console.log(
              "Substracting in the nested if",
              totalWithdrawals,
              deposit.amount,
              totalWithdrawals.minus(deposit.amount),
              i,
            );

            totalWithdrawals = totalWithdrawals.minus(
              Decimal.min(totalWithdrawals, deposit.amount),
            );

            break;
          }

          // this.logger.debug("Matched deposit", i);
          totalWithdrawals = totalWithdrawals.minus(deposit.amount);

          matched_status = {
            index: i,
            partial_remaining: new Decimal(0),
          };
        }
        this.logger.verbose(
          all_deposits.reduce((acc, curr) => {
            acc = acc.plus(curr.amount);
            return acc;
          }, new Decimal(0)).toString(),
        );
        // Assert that totalWithdrawals is zero here
        assert(totalWithdrawals.eq(0), "Total withdrawals should be zero");

        this.logger.log("Matched status", matched_status);
        if (matched_status.index === -1) {
          this.logger.error(
            "More withdrawals than deposits for user",
            update.block_number,
            update.tx_index,
            update.event_index,
            "totalWithdrawals",
            totalWithdrawals,
          );
          throw new Error("More withdrawals than deposits for user");
        }

        let yet_to_match;
        if (update.eventType === "withdrawal") {
          yet_to_match = update.shares;
        } else if (update.eventType === "transfer") {
          yet_to_match = update.value;
        } else {
          throw new Error("Invalid event type");
        }
        let order_index = 0;

        // Start matching the current withdraw amount
        // First mathching if any partial amount is remaining
        if (matched_status.partial_remaining.gt(0)) {
          const matched_amount = Decimal.min(
            yet_to_match,
            matched_status.partial_remaining,
          );

          const deposit = all_deposits.at(matched_status.index);
          if (!deposit) {
            throw new Error("Deposit not found while partial matching");
          }

          // Push withdrawal entry to ledger
          const withdrawal = {
            block_number: update.block_number,
            tx_index: update.tx_index,
            event_index: update.event_index,
            order_index: order_index,
            user: owner,
            amount: matched_amount,
            type: "WITHDRAWAL" as TransactionType,
            referral_code: deposit.referral_code,
          };
          yet_to_match = yet_to_match.minus(matched_amount);
          order_index += 1;

          newLedgerTransactions.push(withdrawal);
          // In case of transfers just append the same transaction as deposit to receiver
          if (update.eventType === "transfer") {
            const transfer: LedgerWithOptionalId = {
              block_number: update.block_number,
              tx_index: update.tx_index,
              event_index: update.event_index,
              order_index: order_index,
              user: update.to,
              amount: matched_amount,
              type: "DEPOSIT" as TransactionType,
              referral_code: deposit.referral_code,
            };

            order_index += 1;
            newLedgerTransactions.push(transfer);

            this.logger.log("Pushed transfer entry to ledger");
          }
          this.logger.log("Pushed partial withdrawal entry to ledger");
        }

        if (yet_to_match.eq(0)) {
          if (
            update.eventType === "withdrawal" || update.eventType === "transfer"
          ) {
            this.logger.log(
              `Finished ${update.eventType} update for`,
              update.block_number,
              update.tx_index,
              update.event_index,
              "✅✅✅",
            );
          }
          continue;
        }
        // Matching other deposits now
        for (let i = matched_status.index + 1; i < all_deposits.length; i++) {
          const deposit = all_deposits.at(i);
          if (!deposit?.amount) {
            throw Error("Amount not present in deposit transaction");
          }
          const matched_amount = Decimal.min(
            yet_to_match,
            deposit.amount,
          );

          // Push withdrawal entry to ledger
          const withdrawal: LedgerWithOptionalId = {
            block_number: update.block_number,
            tx_index: update.tx_index,
            event_index: update.event_index,
            order_index: order_index,
            user: owner,
            amount: matched_amount,
            type: "WITHDRAWAL",
            referral_code: deposit.referral_code,
          };

          order_index += 1;
          yet_to_match = yet_to_match.minus(matched_amount);
          newLedgerTransactions.push(withdrawal);
          this.logger.log("Pushed withdrawal entry to ledger");

          // In case of transfers just append the same transaction as deposit to receiver
          if (update.eventType === "transfer") {
            const transfer: LedgerWithOptionalId = {
              block_number: update.block_number,
              tx_index: update.tx_index,
              event_index: update.event_index,
              order_index: order_index,
              user: update.to,
              amount: matched_amount,
              type: "DEPOSIT" as TransactionType,
              referral_code: deposit.referral_code,
            };

            order_index += 1;
            newLedgerTransactions.push(transfer);

            this.logger.log("Pushed transfer entry to ledger");
          }

          if (yet_to_match.eq(0)) {
            break;
          }
        }

        console.log("does this get printed");

        if (
          update.eventType === "withdrawal" || update.eventType === "transfer"
        ) {
          this.logger.log(
            `Finished ${update.eventType} update for`,
            update.block_number,
            update.tx_index,
            update.event_index,
          );
        }
      } else {
        throw new Error("Invalid event type");
      }
    }

    // Making the final transaction
    // If any error in any transaction occurs
    // the entire transaction will be rolled back
    await this.prisma.$transaction(async () => {
      this.logger.log("Updating ledger...");
      await this.prisma.ledger.createMany({
        data: newLedgerTransactions,
      });

      if (deposits.length > 0) {
        // Update the processed state
        await this.prisma.processedState.update({
          data: {
            block_number: deposits[deposits.length - 1].block_number,
            tx_index: deposits[deposits.length - 1].tx_index,
            event_index: deposits[deposits.length - 1].event_index,
          },
          where: {
            type: "DEPOSIT",
          },
        });
      }

      if (withdrawals.length > 0) {
        await this.prisma.processedState.update({
          data: {
            block_number: withdrawals[withdrawals.length - 1].block_number,
            tx_index: withdrawals[withdrawals.length - 1].tx_index,
            event_index: withdrawals[withdrawals.length - 1].event_index,
          },
          where: {
            type: "WITHDRAWAL",
          },
        });
      }

      if (transfers.length > 0) {
        await this.prisma.processedState.update({
          data: {
            block_number: transfers[transfers.length - 1].block_number,
            tx_index: transfers[transfers.length - 1].tx_index,
            event_index: transfers[transfers.length - 1].event_index,
          },
          where: {
            type: "TRANSFER",
          },
        });
      }
    });

    this.logger.log("Ledger populated successfully");
  }
}
