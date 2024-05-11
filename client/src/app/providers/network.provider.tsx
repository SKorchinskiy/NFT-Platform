"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  NETWORK,
  HARDHAT,
  ETHEREUM,
  BINANCE,
  POLYGON,
} from "../../configs/networks";
import { MetamaskContext } from "./metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";

export const NetworkContext = createContext({
  network: {} as NETWORK,
  switchNetwork: (_: string) => {},
});

const DEFAULT_NETWORK: NETWORK = HARDHAT;

export default function NetworkProvider({ children }: PropsWithChildren) {
  const [network, setNetwork] = useState<NETWORK>(DEFAULT_NETWORK);

  const { provider } = useContext(MetamaskContext);

  const switchNetwork = (network: string) => {
    switch (network) {
      case "Ethereum":
        setNetwork(ETHEREUM);
        break;
      case "Binance":
        setNetwork(BINANCE);
        break;
      case "Polygon":
        setNetwork(POLYGON);
        break;
      default:
        setNetwork(HARDHAT);
    }
  };

  useEffect(() => {
    const changeNetwork = async (
      provider: MetaMaskInpageProvider,
      network: NETWORK
    ) => {
      console.log({ network });
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        });
      } catch (error: any) {
        console.log({ error });
        if (error.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainId,
                chainName: network.name,
                rpcUrls: network.rpc_servers,
                nativeCurrency: {
                  decimals: 18,
                  name: network.symbol,
                  symbol: network.symbol,
                },
              },
            ],
          });
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network.chainId }],
          });
        }
      }
    };

    if (provider && network) {
      changeNetwork(provider, network);
    }
  }, [provider, network]);

  return (
    <NetworkContext.Provider value={{ network, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}
