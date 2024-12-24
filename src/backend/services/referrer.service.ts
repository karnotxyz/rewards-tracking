import { Injectable, Logger } from "@nestjs/common";
import type { Commissions, Ledger, PrismaClient } from "generated/index.d.ts";
import { prisma } from "prisma/client.ts";
import { assert } from "@std/assert";
import { readReferrers, saveReferrers } from "./constants.ts";
import { sortEntries } from "./utils.ts";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class ReferrerService {
  private readonly logger: Logger;
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
    this.logger = new Logger(ReferrerService.name);
  }

  // Assumes that the exchange rates are already populated
  async calculateCommissions() {
    // Assert that till the latest ledger entry's block number,
    // the exchange rates are populated
    const lastLedgerEntry = await this.prisma.ledger.findFirst({
      orderBy: { block_number: "desc" },
    });
    const lastExchangeRate = await this.prisma.exchangeRate.findFirst({
      orderBy: { block_number: "desc" },
    });
    if (!lastLedgerEntry || !lastExchangeRate) {
      this.logger.log("No ledger entries or exchange rates found");
      return;
    }
    assert(lastLedgerEntry.block_number <= lastExchangeRate.block_number);

    this.logger.log("Calculating commissions");

    const allReferrers = await this.prisma.referrers.findMany({});
    if (!allReferrers || allReferrers.length === 0) {
      this.logger.log("No referrers found");
      return;
    }

    const processed_commissions: Commissions[] = await this.prisma
      .commissions
      .findMany({
        orderBy: {
          id: "desc",
        },
      });

    const ledgerEntriesRes = await this.prisma.ledger.findMany({});
    const ledgerEntries = sortEntries(ledgerEntriesRes);

    const allExchangeRates = await this.prisma.exchangeRate.findMany({});

    let commissions = [];
    for (const referrer of allReferrers) {
      const thisReferrerCommissions = processed_commissions.filter((c) =>
        c.referral_code === referrer.referral_code
      );

      // Find the last processed commission
      const lastProcessedCommissionThisReferrer =
        thisReferrerCommissions.sort((a, b) => {
          return Number(b.id) - Number(a.id);
        })[0];

      let ledgerEntriesToProcessFromIndex = ledgerEntries.findIndex((entry) =>
        entry.id === lastProcessedCommissionThisReferrer.ledger_id
      );

      let totalCommission = new Decimal(0);

      const runningReferralAmount = new Decimal(0);

      const thisReferrerEntries = ledgerEntries.filter((entry) =>
        entry.referral_code && entry.referral_code === referrer.referral_code
      );
      for (let i = 0; i < thisReferrerEntries.length; i++) {
        const entry = ledgerEntries[i];
        if (
          entry.referral_code && entry.referral_code === referrer.referral_code
        ) {
          // Update the running referral amount
          if (entry.type === "DEPOSIT") {
            runningReferralAmount.add(new Decimal(entry.amount.toString()));
          } else if (entry.type === "WITHDRAWAL") {
            runningReferralAmount.sub(new Decimal(entry.amount.toString()));
          }

          if (i < ledgerEntriesToProcessFromIndex) {
            continue;
          }

          const exchangeRateAtBlockObj = allExchangeRates.find((rate) =>
            rate.block_number === entry.block_number
          );
          let exchangeRateAtBlock = new Decimal(1);
          if (!exchangeRateAtBlockObj) {
            this.logger.error(
              `Exchange rate not found for block number ${entry.block_number}`,
            );
            throw new Error("Exchange rate not found");
            return;
          }
          exchangeRateAtBlock = exchangeRateAtBlockObj.rate;
          let exchangeRateBefore = new Decimal(1);
          if (i > 0 && allExchangeRates) {
            const exchangeRateObjectBefore = allExchangeRates?.find((rate) =>
              rate.block_number === thisReferrerEntries[i - 1]?.block_number
            );
            if (exchangeRateObjectBefore) {
              exchangeRateBefore = exchangeRateObjectBefore.rate;
            } else {
              this.logger.error("Exchange rate not found");
              throw new Error("Exchange rate not found");
            }
          }
          const exchangeRateDifference = exchangeRateAtBlock.sub(
            exchangeRateBefore,
          );

          // Calculate the commission
          const commission = runningReferralAmount.mul(exchangeRateDifference) // Total appreciation
            .mul(15) // 15% commission taken by Endur
            .mul( // Referrer's commission
              new Decimal(referrer.percentage),
            ).div(new Decimal(100_00));

          totalCommission.add(commission);
        }
      }

      commissions.push({
        referral_code: referrer.referral_code,
        commission_amount: totalCommission,
        is_paid: false,
        ledger_id: ledgerEntries[ledgerEntries.length - 1].id,
      });
    }

    await this.prisma.commissions.createMany({
      data: commissions,
    });
  }

  // Note you cant update the Percentage of any existing referrer
  // The current implementation may break in such a case
  async addReferrers() {
    this.logger.log("Adding referrer");
    const referrers = await readReferrers();

    await this.prisma.$transaction(async () => {
      for (const referrer of referrers) {
        await this.prisma.referrers.upsert({
          create: referrer,
          update: referrer,
          where: {
            referral_code: referrer.referral_code,
          },
        });
      }
    });
  }

  async getReferrers() {
    this.logger.log("Getting referrers");
    const referrers = await this.prisma.referrers.findMany({});
    saveReferrers(referrers);
  }
}
