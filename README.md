### Installation

This project uses deno. So install deno first

1. Then to install dependencies run: `deno install`

2. Update `.env` using the `.env.example` and update the dna token from apibara

3. For generating the prisma client and tables run:
   `deno run -A npm:prisma generate && deno run -A npm:prisma db push`

### Running the Server

`deno run dev`

### Event Emission

Events are emitted during each function in this particular order

1. Depositing
   - `Transfer` with from address = 0x0
   - `Deposit`
2. Depositing with a referral
   - `Transfer` with from address = 0x0
   - `Deposit`
   - `Referral`
3. Withdrawal of xstrk
   - `Approval` (not always, only when caller != owner) // while spending
     allowance of strk
   - `Transfer` with to address = 0x0
   - `Withdraw`
4. Transfering tokens
   - `Transfer`

#### Note

There are 2 entry points for Depositing `fn deposit()` and `fn mint()` and 2 for
withdraing `fn withdraw()` and `fn redeem()` but have verfied the above event
flow remains the same regardless of the function chosen as entry point

#### Problem

- To not double count any transaction by listening events
  - Not double counting deposits and deposit with referral
  - to not double count transfer in mint/burn(deposit/withdrawl)
- There could be muticall in a single transaction too emitting multple of the
  above together

#### Solutions strategy

- To listen only events that emitted from the lst contract
- Ignore the `Transfer` events that have either the `from` as 0x0 or `to` 0x0
- Not listen for explicitly `Referral` event but only `Deposit` to check for the
  Referral by following
  - To check the transaction reciepts of each transaction which has all the
    evnets emitted in that transaction
  - Filter out the events that emitted from the lst contract
  - For each deposit check that exactly after `Deposit` event `Referral` is
    present or not
  - if yes thats referral txn otherwise not, then store referal code in the
    deposits table
  - if not consider it as normal deposit event
