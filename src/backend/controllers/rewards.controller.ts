import { Controller, Get } from "@nestjs/common";
import { LedgerService } from  "../services/ledger.service";
import { LSTService } from "../services/lst.service";
import { ReferrerService } from "../services/referrer.service";

@Controller()
export class RewardsController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly rpcService: LSTService,
    private readonly referrerService: ReferrerService,
  ) {}

  // TODO: Update to Post later
  @Get("/rewards")
  async populateLedger() {
    await this.ledgerService.populateLedger();
  }

  @Get("/exchange-rates")
  async populateExchangeRates() {
    const exchangeRate = await this.rpcService.getRequiredExchangRates();
    console.log(exchangeRate);
  }

  @Get("/get-referrers")
  async getReferrers() {
    await this.referrerService.getReferrers();
  }

  @Get("/add-referrers")
  async addReferrers() {
    await this.referrerService.addReferrers();
  }

  @Get("/commissions")
  async calculateCommissions() {
    await this.populateExchangeRates();
    await this.referrerService.calculateCommissions();
  }
}
