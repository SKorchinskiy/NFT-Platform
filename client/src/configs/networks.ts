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
    nftCollectionContract: "0xDBEEEf4EC51d54D01DC73407f6923ec44b989B3C",
    marketResellContract: "0x5C2e49391edAE0B5322622A2db972402d3EB41b4",
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
  rpc_servers: ["wss://bsc-testnet-rpc.publicnode.com"],
  symbol: "tBNB",
  contracts: {
    nftCollectionContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketResellContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketCreateContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    nftCreateContract: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    englishAuctionContract: "<CONTRACT ADDRESS>",
    blindAuctionContract: "<CONTRACT ADDRESS>",
  },
};

// Mumbai
export const POLYGON: NETWORK = {
  name: "Polygon",
  chainId: "0x13881",
  rpc_servers: ["https://polygon-testnet.public.blastapi.io"],
  symbol: "MATIC",
  contracts: {
    nftCollectionContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketResellContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketCreateContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    nftCreateContract: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    englishAuctionContract: "<CONTRACT ADDRESS>",
    blindAuctionContract: "<CONTRACT ADDRESS>",
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
