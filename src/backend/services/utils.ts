import { Account, RpcProvider } from "npm:starknet";
import { assert } from "@std/assert";

import {
  WithDepositEventType,
  WithTransferEventType,
  WithWithdrawalEventType,
} from "./ledger.service.ts";

type SortableEntry =
  | WithDepositEventType
  | WithWithdrawalEventType
  | WithTransferEventType;
export function sortEntries(
  entries: Array<SortableEntry>,
): Array<SortableEntry> {
  return entries.sort((a, b) => {
    if (a.block_number !== b.block_number) {
      return a.block_number - b.block_number;
    }
    if (a.tx_index !== b.tx_index) {
      return a.tx_index - b.tx_index;
    }
    return a.event_index - b.event_index;
  });
}

export function getProvider(): RpcProvider {
  assert(Deno.env.has("RPC_URL"), "RPC URL not set in .env");
  // use this to explicitly read from .env of this project
  // (VT: I have some global env variables set as well)
  return new RpcProvider({ nodeUrl: Deno.env.get("RPC_URL") });
}

export function getAccount(): Account {
  assert(Deno.env.has("PRIVATE_KEY"), "PRIVATE KEY not set in .env");
  assert(Deno.env.has("ACCOUNT_ADDRESS"), "PRIVATE KEY not set in .env");

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
