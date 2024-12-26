export enum Network {
  mainnet = "mainnet",
  sepolia = "sepolia",
  devnet = "devnet",
}

export type NetworkAddresses = {
  LST: string;
  WithdrawQueue: string;
  Strk: string;
  Delgator: string[];
};

export const mainnetAddresses: NetworkAddresses = {
  LST: "0x28d709c875c0ceac3dce7065bec5328186dc89fe254527084d1689910954b0a",
  WithdrawQueue:
    "0x518a66e579f9eb1603f5ffaeff95d3f013788e9c37ee94995555026b9648b6",
  Strk: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  Delgator: [
    "0x76d15a66bec239c54a727056a8ab04b14f5441a2f559e6eb471cc7e8e878d99",
    "0x4c1408cd9653f282794de18241031b6a1acff17f1fc6603654877c34ce859ba",
  ],
};

export const sepoliaAddresses: NetworkAddresses = mainnetAddresses;
