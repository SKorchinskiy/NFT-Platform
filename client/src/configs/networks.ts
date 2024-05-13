export type NETWORK = {
  name: string;
  chainId: string;
  rpc_servers: Array<string>;
  symbol: string;
  block_explorer?: string;
  contracts: { [key: string]: string };
};

// testnets
export const ETHEREUM: NETWORK = {
  name: "Sepolia Testnet",
  chainId: "0xaa36a7",
  rpc_servers: ["https://rpc.sepolia.org"],
  symbol: "SepoliaETH",
  block_explorer: "https://sepolia.etherscan.io",
  contracts: {
    nftCollectionContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    marketResellContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketCreateContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    nftCreateContract: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    englishAuctionContract: "<CONTRACT ADDRESS>",
    blindAuctionContract: "<CONTRACT ADDRESS>",
  },
};

export const BINANCE: NETWORK = {
  name: "BNB Smart Chain Testnet",
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

export const POLYGON: NETWORK = {
  name: "Mumbai",
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

export const HARDHAT: NETWORK = {
  name: "Hardhat Local",
  chainId: "0x7a69",
  rpc_servers: ["http://localhost:8545"],
  symbol: "HH",
  contracts: {
    nftCollectionContract: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    marketResellContract: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    marketCreateContract: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    nftCreateContract: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    englishAuctionContract: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    blindAuctionContract: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
  },
};
