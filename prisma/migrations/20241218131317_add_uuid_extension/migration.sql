-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('deposit', 'withdrawal');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('deposit', 'withdrawal', 'transfer');

-- CreateTable
CREATE TABLE "deposits" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "assets" DECIMAL(30,0) NOT NULL,
    "shares" DECIMAL(30,0) NOT NULL,
    "referrer" TEXT,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "transfer" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" DECIMAL(30,0) NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "timestamp" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "assets" DECIMAL(30,0) NOT NULL,
    "shares" DECIMAL(30,0) NOT NULL,
    "_cursor" BIGINT
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "block_number" INTEGER NOT NULL,
    "tx_index" INTEGER NOT NULL DEFAULT 0,
    "event_index" INTEGER NOT NULL DEFAULT 0,
    "order_index" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "amount" DECIMAL(30,0) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "referral_code" TEXT,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "block_number" INTEGER NOT NULL,
    "rate" DECIMAL(30,0) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("block_number")
);

-- CreateTable
CREATE TABLE "Commissions" (
    "referral_code" TEXT NOT NULL,
    "commission_amount" DECIMAL(30,0) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "ledger_id" UUID NOT NULL,

    CONSTRAINT "Commissions_pkey" PRIMARY KEY ("ledger_id","referral_code")
);

-- CreateTable
CREATE TABLE "Referrers" (
    "referral_code" TEXT NOT NULL,
    "referrer" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Referrers_pkey" PRIMARY KEY ("referral_code")
);

-- CreateTable
CREATE TABLE "ProcessedState" (
    "type" "EventType" NOT NULL,
    "row_id" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "deposits__cursor_idx" ON "deposits"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "deposits_block_number_tx_index_event_index_key" ON "deposits"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "transfer__cursor_idx" ON "transfer"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_block_number_tx_index_event_index_key" ON "transfer"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE INDEX "withdrawals__cursor_idx" ON "withdrawals"("_cursor");

-- CreateIndex
CREATE UNIQUE INDEX "withdrawals_block_number_tx_index_event_index_key" ON "withdrawals"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_block_number_tx_index_event_index_key" ON "Ledger"("block_number", "tx_index", "event_index");

-- CreateIndex
CREATE UNIQUE INDEX "Referrers_referrer_key" ON "Referrers"("referrer");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedState_type_key" ON "ProcessedState"("type");

-- AddForeignKey
ALTER TABLE "Commissions" ADD CONSTRAINT "Commissions_referral_code_fkey" FOREIGN KEY ("referral_code") REFERENCES "Referrers"("referral_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commissions" ADD CONSTRAINT "Commissions_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "Ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
