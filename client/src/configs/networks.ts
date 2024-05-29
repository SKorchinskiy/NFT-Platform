export type NETWORK = {
  name: string;
  chainId: string;
  rpc_servers: Array<string>;
  symbol: string;
  block_explorer?: string;
  contracts: { [key: string]: string };
};

// holesky testnet
export const ETHEREUM: NETWORK = {
  name: "Ethereum",
  chainId: "0x4268",
  rpc_servers: ["https://ethereum-holesky-rpc.publicnode.com"],
  symbol: "ETH",
  block_explorer: "https://holesky.etherscan.io",
  contracts: {
    nftCollectionContract: "0xa6733d7CF0024077B2e5c78a57c65580a1294Cf2",
    marketResellContract: "0xC67A29beE929b68E09CEb1C097F3E9F43f72aA84",
    marketCreateContract: "0xeA274E7C97Fb12b1b0aAB00Fa5f1F39170d35D6A",
    nftCreateContract: "0xdB267e96fDBA8Ebe8844D1959D97F271fcD5144F",
    englishAuctionContract: "0x6f013EB6BFF07D118dd3FF87f7fD9bFb5be3991A",
    blindAuctionContract: "0x46980a74E17075341756dDcb9942D8f13f850F91",
  },
};

// BNB smartchain testnet
export const BINANCE: NETWORK = {
  name: "Binance",
  chainId: "0x61",
  rpc_servers: ["https://endpoints.omniatech.io/v1/bsc/testnet/public"],
  symbol: "tBNB",
  contracts: {
    nftCollectionContract: "0x5fFf9293EE92ae2427CEb12ebAc489fB47114f9a",
    marketResellContract: "0x7dc2a9AB8cFCde21F24075Df04FeA14DD01d9c3A",
    marketCreateContract: "0x8CbE822bd71aed53Fc68D23baDa79B4682E8e541",
    nftCreateContract: "0x94b6A1E6dDC0b791DD8bEF9997bC6F7Dc3566eA8",
    englishAuctionContract: "0x04433124035439eDbbB6A9709891d910cFD3CF73",
    blindAuctionContract: "0xeD46dF7B0D50bf9ed71fdFBCeB3973b4CC1C68B4",
  },
};

// Amoy
export const POLYGON: NETWORK = {
  name: "Polygon",
  chainId: "0x13882",
  rpc_servers: ["https://rpc-amoy.polygon.technology"],
  symbol: "MATIC",
  contracts: {
    nftCollectionContract: "0x94a95885492F806B8154Ec5Aa9913eA6Fb76D7bb",
    marketResellContract: "0xF594Ac85e25764496aBf8Ef4b1B76148FBa1f05f",
    marketCreateContract: "0x8CbE822bd71aed53Fc68D23baDa79B4682E8e541",
    nftCreateContract: "0x94b6A1E6dDC0b791DD8bEF9997bC6F7Dc3566eA8",
    englishAuctionContract: "0x94b6A1E6dDC0b791DD8bEF9997bC6F7Dc3566eA8",
    blindAuctionContract: "0x557e33Bd69c8afcf48427d6d0Bef990Ff05788A4",
  },
};

// Local
export const HARDHAT: NETWORK = {
  name: "Hardhat",
  chainId: "0x7a69",
  rpc_servers: ["http://localhost:8545"],
  symbol: "HH",
  contracts: {
    nftCollectionContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketResellContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketCreateContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    nftCreateContract: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    englishAuctionContract: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    blindAuctionContract: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  },
};
