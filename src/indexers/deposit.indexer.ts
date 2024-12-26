import type { Config } from "npm:@apibara/indexer";
import type {
  Block,
  Event,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash, num } from "https://esm.sh/starknet@6.11.0";

import { getAddresses, getNetwork, toBigInt } from "./utils/utils.ts";
import { standardiseAddress } from "./utils/utils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),

  finality: "DATA_STATUS_PENDING", // TODO: Should this be "DATA_STATUS_PENDING" or "DATA_STATUS_FINALIZED"?
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: getAddresses(getNetwork()).LST as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("Deposit") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "deposits",
  },
};

// #[derive(Drop, Serde, starknet::Event)]
// struct Referral {
//     #[key]
//     pub referrer: ByteArray,
//     #[key]
//     pub referee: ContractAddress,
//     pub assets: u256,
// }

// #[derive(Drop, PartialEq, starknet::Event)]
// pub struct Deposit {
//     #[key]
//     pub sender: ContractAddress,
//     #[key]
//     pub owner: ContractAddress,
//     pub assets: u256,
//     pub shares: u256
// }

export default function transform({ header, events }: Block) {
  if (!events || !header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000,
  );

  return events.map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("deposits:Expected event with data");
    }

    let referral_code;
    if (receipt.events) {
      // Find the index of the `Deposit` event by matching the event index
      // Since this from receipt of the same transaction of the same block
      // Tx_index and Block_number are the same for all events
      // console.log("receipt events", receipt.events);
      const ind = receipt.events?.findIndex((e: Event) => {
        return Number(e.index ?? 0) == event.index;
      });

      // Check if exactly next event if exists is the `Referral` event
      if (ind && receipt.events.length > ind + 1) {
        if (
          standardiseAddress(receipt.events[ind + 1].keys?.[0] as string) ==
            standardiseAddress(
              hash.getSelectorFromName("Referral") as FieldElement as string,
            )
        ) {
          const referrer = receipt.events[ind + 1]?.keys?.[2];

          if (!referrer) {
            throw new Error("Referrer is required");
          }

          referral_code = num.toHexString(referrer).toString()
            .match(/.{1,2}/g)
            ?.reduce(
              (acc, char) => acc + String.fromCharCode(parseInt(char, 16)),
              "",
            )?.replace(/\0/g, ""); // Remove null bytes

          console.log("referral code", referral_code, receipt.transactionHash);
        }
      }
    }

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const sender = event?.keys?.[1];
    const owner = event?.keys?.[2];

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const assets = toBigInt(event?.data?.[0]).toString();
    const shares = toBigInt(event?.data?.[2]).toString();

    const depositData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      timestamp: timestamp_unix,
      sender,
      owner,
      assets,
      shares,
      referrer: referral_code,
    };

    console.log("deposit data", depositData);
    return depositData;
  });
}
