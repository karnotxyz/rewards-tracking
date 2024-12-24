import type { Referrers } from "generated/index.d.ts";
export enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}

type NetworkAddresses = {
  LST: string;
  WithdrawQueue: string;
  Strk: string;
};

const sepolia: NetworkAddresses = {
  LST: "0x42de5b868da876768213c48019b8d46cd484e66013ae3275f8a4b97b31fc7eb",
  WithdrawQueue:
    "0x254cbdaf8275cb1b514ae63ccedb04a3a9996b1489829e5d6bbaf759ac100b6",
  Strk: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
};

const mainnet: NetworkAddresses = {
  LST: "0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a",
  WithdrawQueue:
    "0x518a66e579f9eb1603f5ffaeff95d3f013788e9c37ee94995555026b9648b6",
  Strk: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
};

export function getAddresses(network: Network): NetworkAddresses {
  switch (network) {
    case Network.sepolia: {
      return sepolia;
    }
    case Network.mainnet: {
      return mainnet;
    }
    default: {
      throw new Error("Relayer not yet configured for Mainnet");
    }
  }
}

export async function readReferrers(): Promise<Referrers[]> {
  const PATH = "./referrers.json";
  try {
    await Deno.stat(PATH);
    return JSON.parse(await Deno.readTextFile(PATH));
  } catch (err) {
    console.log("referrers.json not found", err);
  }
  return [];
}

export async function saveReferrers(referrers: Referrers[]) {
  const PATH = "./referrers.json";
  await Deno.writeTextFile(PATH, JSON.stringify(referrers));
}
