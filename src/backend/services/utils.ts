import { Account, RpcProvider } from "starknet";
import assert = require("assert");

import {
  WithDepositEventType,
  WithTransferEventType,
  WithWithdrawalEventType,
} from "./ledger.service";
import { Ledger } from "@prisma/client";

export function sortEntries<
  T extends
    | WithDepositEventType
    | WithWithdrawalEventType
    | WithTransferEventType
    | Ledger,
>(
  entries: T[],
): T[] {
  return entries.sort((a, b) => {
    if (a.block_number !== b.block_number) {
      return a.block_number - b.block_number;
    }
    if (a.tx_index !== b.tx_index) {
      return a.tx_index - b.tx_index;
    }
    if ("order_index" in a && "order_index" in b) {
      if (a.event_index !== b.event_index) {
        return a.event_index - b.event_index;
      }
      return a.order_index - b.order_index;
    } else {
      return a.event_index - b.event_index;
    }
  });
}

export function getProvider(): RpcProvider {
  assert(process.env.RPC_URL, "RPC URL not set in .env");
  return new RpcProvider({ nodeUrl: process.env.RPC_URL });
}

export function getAccount(): Account {
  assert(process.env.PRIVATE_KEY, "PRIVATE KEY not set in .env");
  assert(process.env.ACCOUNT_ADDRESS, "ACCOUNT ADDRESS not set in .env");

  // initialize provider
  const provider = getProvider();
  const privateKey = process.env.PRIVATE_KEY as string;
  const accountAddress = process.env.ACCOUNT_ADDRESS as string;
  return new Account(provider, accountAddress, privateKey);
}

export enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}

export interface NetworkConfig {
  provider: RpcProvider;
  account: Account;
  network: Network;
}

export function getNetwork(): Network {
  assert(process.env.NETWORK, "Network not configured in .env");

  const network = process.env.NETWORK as string;
  if (network == Network.sepolia) {
    return Network.sepolia;
  } else if (network == Network.mainnet) {
    return Network.mainnet;
  } else {
    throw new Error("Incorrect network configured, check .env file");
  }
}
