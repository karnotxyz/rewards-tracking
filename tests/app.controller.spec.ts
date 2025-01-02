
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { deposits, PrismaClient } from "@prisma/client";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../src/backend/main";
import { INestApplication } from "@nestjs/common";
import { execSync } from "child_process";
import * as request from "supertest";
import { RewardsController } from "../src/backend/controllers/rewards.controller";
import { LedgerService } from "../src/backend/services/ledger.service";
import { Decimal } from "@prisma/client/runtime/library";


let prismaClient: PrismaClient;
let pgContainer: StartedPostgreSqlContainer;
let app: INestApplication;
let connectionURI: string;

let user1 = "0x123";
let user2 = "0x456";

jest.setTimeout(60000);

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
    execSync("npx prisma migrate reset -f", { env: { ...process.env, DATABASE_URL: connectionURI } });
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
    expect(depositsBefore.length).toBe(0);
    expect(depositsBefore).toEqual([]);

    const newDeposits = [
      {
        block_number: 1,
        tx_index: 1,
        event_index: 1,
        timestamp: 1,

        sender: user1,
        owner: user1,

        assets: new Decimal(1000),
        shares: new Decimal(1000),
        referrer: null,
      },
      {
        block_number: 2,
        tx_index: 1,
        event_index: 1,
        timestamp: 1,

        sender: user2,
        owner: user2,

        assets: new Decimal(1000),
        shares: new Decimal(1000),
        referrer: "9EFE5",
      }
    ];


    // Create test deposit
    await prismaClient.deposits.createMany({
      data: newDeposits,
    });

    const depositsAfter = await prismaClient.deposits.findMany();
    expect(depositsAfter).toMatchObject(newDeposits);

    const ledger = await prismaClient.ledger.findMany();
    expect(ledger).toEqual([]);

    await request(app.getHttpServer()).get("/rewards");


    const newLedgerEntries = [
      {
        block_number: 1,
        tx_index: 1,
        event_index: 1,
        order_index: 0,

        user: user1,
        amount: new Decimal("1000"),
        type: "DEPOSIT",
        referral_code: null,
      },
      {
        block_number: 2,
        tx_index: 1,
        event_index: 1,
        order_index: 0,
        user: user2,
        amount: new Decimal("1000"),
        type: "DEPOSIT",
        referral_code: "9EFE5",
      }
    ]

    const ledgerAfter = await prismaClient.ledger.findMany();
    expect(ledgerAfter).toMatchObject(newLedgerEntries);
  });
});
