import { Account, RpcProvider } from "npm:starknet";
import { assert } from "@std/assert";

import {
  WithDepositEventType,
  WithTransferEventType,
  WithWithdrawalEventType,
} from "./ledger.service.ts";
import { Ledger } from "generated/index.d.ts";

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
  assert(Deno.env.has("RPC_URL"), "RPC URL not set in .env");
  return new RpcProvider({ nodeUrl: Deno.env.get("RPC_URL") });
}

export function getAccount(): Account {
  assert(Deno.env.has("PRIVATE_KEY"), "PRIVATE KEY not set in .env");
  assert(Deno.env.has("ACCOUNT_ADDRESS"), "ACCOUNT ADDRESS not set in .env");

  // initialize provider
  const provider = getProvider();
  const privateKey = Deno.env.get("PRIVATE_KEY") as string;
  const accountAddress = Deno.env.get("ACCOUNT_ADDRESS") as string;
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
  assert(Deno.env.has("NETWORK"), "Network not configured in .env");

  const network = Deno.env.get("NETWORK") as string;
  if (network == Network.sepolia) {
    return Network.sepolia;
  } else if (network == Network.mainnet) {
    return Network.mainnet;
  } else {
    throw new Error("Incorrect network configured, check .env file");
  }
}
