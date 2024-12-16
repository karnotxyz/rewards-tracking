import { Controller, Post } from "@nestjs/common";

@Controller()
export class RewardsController {
  constructor() {
    console.log("RewardsController instantiated");
  }

  @Post()
  postRewards(): string {
    return "Rewards posted";
  }
}
