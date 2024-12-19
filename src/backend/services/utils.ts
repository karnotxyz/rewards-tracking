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
