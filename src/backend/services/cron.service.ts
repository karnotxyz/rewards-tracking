import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CronService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(CronService.name);
  }
}
