import { Injectable, Logger } from "@nestjs/common";
import assert = require("assert");
import { readReferrers, saveReferrers } from "./constants";
import { sortEntries } from "./utils";
import { Decimal } from "@prisma/client/runtime/library";
import { Commissions, PrismaClient } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ReferrerService {
  private readonly logger: Logger;
  constructor(
    private readonly prisma: PrismaService
  ) {
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

    const commissions = [];
    for (const referrer of allReferrers) {
      this.logger.debug("Processing referrer", referrer.referral_code);

      const thisReferrerCommissions = processed_commissions.filter((c) =>
        c.referral_code === referrer.referral_code
      );

      // Find the last processed commission
      const lastProcessedCommissionThisReferrer =
        thisReferrerCommissions.sort((a, b) => {
          return Number(b.id) - Number(a.id);
        })[0];

      let ledgerEntriesToProcessFromIndex;

      // If no entries are processed for this referrer,
      // start from the beginning
      if (!lastProcessedCommissionThisReferrer) {
        ledgerEntriesToProcessFromIndex = 0;
      } else {
        ledgerEntriesToProcessFromIndex = ledgerEntries.findIndex((entry) =>
          entry.id === lastProcessedCommissionThisReferrer.ledger_id
        );
      }

      let totalCommission = new Decimal(0);

      let runningReferralAmount = new Decimal(0);

      let lastReferralAmountChangeIndex = 0;
      for (let i = 0; i < ledgerEntries.length; i++) {
        const entry = ledgerEntries[i];
        if (
          entry.referral_code && entry.referral_code === referrer.referral_code
        ) {
          const oldRunningReferralAmount = runningReferralAmount;
          // Update the running referral amount
          if (entry.type === "DEPOSIT") {
            runningReferralAmount = runningReferralAmount.add(
              new Decimal(entry.amount.toString()),
            );
          } else if (entry.type === "WITHDRAWAL") {
            runningReferralAmount = runningReferralAmount.sub(
              new Decimal(entry.amount.toString()),
            );
          }

          if (i > ledgerEntriesToProcessFromIndex) {
            const exchangeRateAtBlockObj = allExchangeRates.find((rate) =>
              rate.block_number === entry.block_number
            );
            let exchangeRateAtBlock = new Decimal(1);
            if (!exchangeRateAtBlockObj) {
              this.logger.error(
                `Exchange rate not found for block number ${entry.block_number}`,
              );
              throw new Error("Exchange rate not found");
            }
            exchangeRateAtBlock = exchangeRateAtBlockObj.rate;
            let exchangeRateBefore = new Decimal(1);
            if (i > 0 && allExchangeRates) {
              const exchangeRateObjectBefore = allExchangeRates?.find((rate) =>
                rate.block_number ===
                ledgerEntries[lastReferralAmountChangeIndex]?.block_number
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
            const commission = oldRunningReferralAmount.mul(
              exchangeRateDifference,
            ) // Total appreciation
              .mul(15) // 15% commission taken by Endur
              .mul( // Referrer's commission
                new Decimal(referrer.percentage),
              )
              .div(new Decimal(100)) // For endur percentage
              .div(new Decimal(100_00)); // For referral percentage

            totalCommission = totalCommission.add(commission);
          }

          lastReferralAmountChangeIndex = i;
        }
      }

      this.logger.debug(
        "For referrer",
        referrer.referral_code,
        "commission is",
        totalCommission,
      );

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
