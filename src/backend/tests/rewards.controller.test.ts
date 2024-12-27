import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Test } from "@nestjs/testing";
import { RewardsController } from "../controllers/rewards.controller";
import { LedgerService } from "../services/ledger.service";
import { LSTService } from "../services/lst.service";
import { ConfigService } from "../services/config.service";
import { ReferrerService } from "../services/referrer.service";

describe("Customer Repository", () => {
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    console.log("Starting PostgreSQL container");
    postgresContainer = await new PostgreSqlContainer().start();
    console.log("PostgreSQL container started");
    process.env.DATABASE_URL = postgresContainer.getConnectionUri();
    // postgresClient = await new Client({ connectionString: postgresContainer.getConnectionUri() });
    // await postgresClient.connect();
  });

  afterAll(async () => {
    await postgresContainer.stop();
    Test.createTestingModule({
      providers: [LedgerService, LSTService, ConfigService, ReferrerService],
      controllers: [RewardsController],
    }).compile();
  });

  it("should create a new customer", () => {
    console.log("Creating a new customer");
  });

});
