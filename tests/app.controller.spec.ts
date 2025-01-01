
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { PrismaClient } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../src/backend/main";
import { INestApplication } from "@nestjs/common";
import { execSync } from "child_process";
import * as request from "supertest";
import { RewardsController } from "../src/backend/controllers/rewards.controller";
import { LedgerService } from "../src/backend/services/ledger.service";


let prismaClient: PrismaClient;
let pgContainer: StartedPostgreSqlContainer;
let app: INestApplication;
let connectionURI: string;

describe("AppController (e2e)", () => {
  beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer()
      .withUsername('postgres')
      .withPassword('postgres')
      .withDatabase('testdb')
      .withExposedPorts({
        container: 5432,
        host: 5432,
      })
      .start();
    connectionURI = pgContainer.getConnectionUri();
    console.log("PostgreSQL container started with uri: ", connectionURI);

    prismaClient = new PrismaClient({
      datasourceUrl: connectionURI,
    });

    console.log("Prisma client created in tests", connectionURI);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    execSync("npx prisma db push", { env: { ...process.env, DATABASE_URL: connectionURI } });


    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Clean up database after each test
    // try {
    //   await prismaClient.$executeRaw`TRUNCATE TABLE deposits CASCADE`;
    // } catch (error) {
    //   console.error('Error truncating table:', error);
    //   throw error;
    // }
  });

  afterAll(async () => {
    try {
      if (app !== undefined) {
        await app.close();
      }
      if (prismaClient !== undefined) {
        await prismaClient.$disconnect();
      }
      if (pgContainer) {
        await pgContainer.stop();
      }
      execSync("npx prisma migrate reset -f", { env: { ...process.env, DATABASE_URL: connectionURI } });
    } catch (error) {
      console.error("Teardown error:", error);
    }
  }, 10000);

  it("should have created all required tables", async () => {
    const tables: any = await prismaClient.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;

    const tableNames = tables.map(({ table_name }: { table_name: string }) => table_name);
    expect(tableNames).toContain("deposits");
    expect(tableNames).toContain("transfer");
    expect(tableNames).toContain("withdrawals");
    expect(tableNames).toContain("Ledger");
    // Add other expected tables
  });


  it("Should be operational", async () => {
    return request(app.getHttpServer())
      .get("/status")
      .expect(200)
      .expect("Operational");
  });


  it("Should process deposits", async () => {

    const depositsBefore = await prismaClient.deposits.findMany();
    console.log("Deposits Before:", depositsBefore);
    // Create test deposit
    await prismaClient.deposits.create({
      data: {
        block_number: 1,
        timestamp: 1234567890,
        sender: '0x123',
        owner: '0x456',
        assets: '1000',
        shares: '1000'
      }
    });

    const deposits = await prismaClient.deposits.findMany();
    const ledger = await prismaClient.ledger.findMany();
    console.log("Ledger:", ledger.length);
    console.log("Deposits After:", deposits);

    await request(app.getHttpServer()).get("/rewards");


    const ledgerNew = await prismaClient.ledger.findMany();
    console.log("Ledger New:", ledgerNew);
    expect(ledgerNew.length).toBeGreaterThan(ledger.length);

    // let rewardController = app.get<RewardsController>(RewardsController);
    // let ledgerService = app.get<LedgerService>(LedgerService);
    // await rewardController.populateLedger();

    // const ledgerNew = await prismaClient.ledger.findMany();
    // console.log("Ledger:", ledgerNew);
  });
});
