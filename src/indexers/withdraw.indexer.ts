import type { Config } from "npm:@apibara/indexer@0.4.1";
import type {
  Block,
  FieldElement,
  Starknet,
} from "npm:@apibara/indexer@0.4.1/starknet";
import type { Postgres } from "npm:@apibara/indexer@0.4.1/sink/postgres";
import { hash } from "https://esm.sh/starknet@6.11.0";

import { toBigInt } from "./utils.ts";
import { getAddresses, getNetwork } from "./utils.ts";

export const config: Config<Starknet, Postgres> = {
  streamUrl: Deno.env.get("STREAM_URL"),
  startingBlock: Number(Deno.env.get("STARTING_BLOCK")),
  finality: "DATA_STATUS_PENDING",
  network: "starknet",
  filter: {
    header: { weak: true },
    events: [{
      fromAddress: getAddresses(getNetwork()).LST as FieldElement,
      includeTransaction: true,
      keys: [hash.getSelectorFromName("Withdraw") as FieldElement],
    }],
  },
  sinkType: "postgres",
  sinkOptions: {
    connectionString: Deno.env.get("DATABASE_URL"),
    tableName: "withdrawals",
  },
};

// #[derive(Drop, PartialEq, starknet::Event)]
// pub struct Withdraw {
//     #[key]
//     pub sender: ContractAddress,
//     #[key]
//     pub receiver: ContractAddress,
//     #[key]
//     pub owner: ContractAddress,
//     pub assets: u256,
//     pub shares: u256
// }
export default function transform({ header, events }: Block) {
  if (!header) return [];

  const { blockNumber, timestamp } = header;
  // Convert timestamp to unix timestamp
  const timestamp_unix = Math.floor(
    new Date(timestamp as string).getTime() / 1000,
  );

  return (events || []).map(({ event, receipt }) => {
    if (!event || !event.data || !event.keys) {
      throw new Error("tranfers:Expected event with data");
    }

    console.log(
      "event keys and data length",
      event.keys.length,
      event.data.length,
    );

    // The 0th key is the selector(name of the event)
    // The following are those that are indexed using #[key] macro
    const sender = event?.keys?.[1];
    const receiver = event?.keys?.[2];
    const owner = event?.keys?.[3];

    // Since `assets` and `shares` are both u256, they take up 2 felts
    // Assuming the second felt is zero
    // TODO: Update this later to properly handle using sn.js
    const assets = toBigInt(event?.data?.[0]).toString();
    const shares = toBigInt(event?.data?.[2]).toString();

    const withdrawData = {
      block_number: blockNumber,
      tx_index: receipt.transactionIndex ?? 0,
      event_index: event.index ?? 0,
      timestamp: timestamp_unix,
      sender,
      receiver,
      owner,
      assets,
      shares,
    };

    console.log("event data", withdrawData);
    return withdrawData;
  });
}
