import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { RewardsController } from "../controllers/rewards.controller";
import { LedgerService } from "../services/ledger.service";
import { LSTService } from "../services/lst.service";
import { ConfigService } from "../services/config.service";
import { ReferrerService } from "../services/referrer.service";
import { AppModule } from "../main";
import { execSync } from 'child_process';
import { prisma } from "../../../prisma/client";
import { PrismaClient } from "@prisma/client";


describe("Customer Repository", () => {
  jest.setTimeout(6000);
  let postgresContainer: StartedPostgreSqlContainer;
  let app: INestApplication;
  let prismaClient: PrismaClient;


  beforeAll(async () => {
    console.log("Starting PostgreSQL container");
    postgresContainer = await new PostgreSqlContainer()
      .withDatabase("test_db")
      .withUsername("test_user")
      .withPassword("test_password")
      .start();

    console.log("PostgreSQL container started");
    const connectionString = postgresContainer.getConnectionUri(); 
    process.env.DATABASE_URL = connectionString;

    prismaClient = new PrismaClient({
      datasourceUrl: connectionString,
    });
  
    try {
        // Run Prisma migrations
      execSync('npx prisma db push --accept-data-loss', {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: postgresContainer.getConnectionUri(),
          NODE_ENV: 'test',
        },
      });
    } catch (error) {
      console.error('Error running Prisma migrations:', error);
      throw error;
    }

    console.log("Database URL:", process.env.DATABASE_URL);

    // // Optionally check specific table structure
    // const deposits = await prisma.$queryRaw`
    //   SELECT * 
    //   FROM deposits;
    // `;
    // console.log("Deposits table structure:", deposits.length);
  }, 60000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // Clean up database after each test
    try {
      await prisma.$executeRaw`TRUNCATE TABLE deposits CASCADE`;
    } catch (error) {
      console.error('Error truncating table:', error);
      throw error;
    }
    // await prisma.$executeRaw`TRUNCATE TABLE deposits CASCADE`;

    // Add other tables as needed
  });


  afterAll(async () => {
    // Proper cleanup order
    try {
      await prismaClient.$disconnect();
      if (app) {
        await app.close();
      }
      if (postgresContainer) {
        await postgresContainer.stop();
      }
    } catch (error) {
      console.error('Teardown error:', error);
    }
  });











  // afterAll(async () => {
  //   await prisma.$disconnect(); // Disconnect Prisma
  //   await app.close(); // Close NestJS app
  //   await postgresContainer.stop(); // Stop container
  // });

  it("should have created all required tables", async () => {
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    const tableNames = tables.map(t => t.table_name);
    expect(tableNames).toContain('deposits');
    expect(tableNames).toContain('transfer');
    expect(tableNames).toContain('withdrawals');
    expect(tableNames).toContain('Ledger');
    // Add other expected tables
  });

  it('/ (GET status)', () => {
    return request(app.getHttpServer())
      .get('/status')
      .expect(200)
      .expect('Operational');
  });

  it("Should process deposits", async () => {
    // Create test deposit
    await prisma.deposits.create({
      data: {
        block_number: 1,
        timestamp: 1234567890,
        sender: '0x123',
        owner: '0x456',
        assets: '1000',
        shares: '1000'
      }
    });

    const deposits = await prisma.deposits.findMany();
    const ledger = await prisma.ledger.findMany();
    // console.log("Ledger:", ledger.length);
    // console.log("Deposits:", deposits);

    // return request(app.getHttpServer())
    //   .get('/rewards')
    //   .expect(200);
  });
});