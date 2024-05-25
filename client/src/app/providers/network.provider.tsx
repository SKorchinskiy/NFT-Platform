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

const DEFAULT_NETWORK: NETWORK = ETHEREUM;

export default function NetworkProvider({ children }: PropsWithChildren) {
  const [network, setNetwork] = useState<NETWORK>(DEFAULT_NETWORK);

  const { provider } = useContext(MetamaskContext);

  const changeNetwork = async (
    provider: MetaMaskInpageProvider,
    network: NETWORK
  ) => {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (error: any) {
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

  const switchNetwork = async (network: string) => {
    switch (network) {
      case "Ethereum":
        if (provider) {
          await changeNetwork(provider, ETHEREUM);
          setNetwork(ETHEREUM);
        }
        break;
      case "Binance":
        if (provider) {
          await changeNetwork(provider, BINANCE);
          setNetwork(BINANCE);
        }
        break;
      case "Polygon":
        if (provider) {
          await changeNetwork(provider, POLYGON);
          setNetwork(POLYGON);
        }
        break;
      default:
        if (provider) {
          await changeNetwork(provider, HARDHAT);
          setNetwork(HARDHAT);
        }
    }
  };

  useEffect(() => {
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
