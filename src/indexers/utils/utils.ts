import { Account, num, RpcProvider } from "https://esm.sh/starknet@6.11.0";
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  mainnetAddresses,
  Network,
  NetworkAddresses,
  sepoliaAddresses,
} from "./constants.ts";

// -------------------------------------------------
// ---------------- Provider utils -----------------
// -------------------------------------------------
export function getProvider(): RpcProvider {
  assert(Deno.env.has("RPC_URL"), "RPC URL not set in .env");
  return new RpcProvider({ nodeUrl: Deno.env.get("RPC_URL") as string });
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

// -------------------------------------------------
// -------------- Chain config utils ---------------
// -------------------------------------------------
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

export function getAddresses(network: Network): NetworkAddresses {
  switch (network) {
    case "sepolia": {
      return sepoliaAddresses;
    }
    case "mainnet": {
      return mainnetAddresses;
    }
    default: {
      throw new Error("Relayer not yet configured for Mainnet");
    }
  }
}

// -------------------------------------------------
// ---------------- Parsing utils ------------------
// -------------------------------------------------

export function toBigInt(value: string | undefined) {
  if (!value) return BigInt(0);

  return BigInt(value.toString());
}

export function toBoolean(value: string) {
  const numValue = Number(BigInt(value));
  if (numValue == 0) return false;
  if (numValue == 1) return true;
  throw new Error("Invalid boolean value");
}

export function toNumber(el: string) {
  if (!el) return 0;
  return Number(el.toString());
}

export function standardiseAddress(address: string | bigint) {
  let _a = address;
  if (!address) {
    _a = "0";
  }
  const a = num.getHexString(num.getDecimalString(_a.toString()));
  return a;
}
