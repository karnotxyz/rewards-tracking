import { Controller, Get, Post } from "@nestjs/common";
import { LedgerService } from "../services/ledger.service.ts";

@Controller()
export class RewardsController {
  constructor(private readonly ledgerService: LedgerService) {}

  // TODO: Update to Post later
  @Get()
  async populateLedger() {
    await this.ledgerService.populateLedger();
  }
}
