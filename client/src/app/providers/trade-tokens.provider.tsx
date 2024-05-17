"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TradeTokens } from "../types/trade-tokens.type";
import { MetamaskContext } from "./metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import useEnglishAuctionContract from "../hooks/useEnglishAuctionContract.hook";
import { AddressContext } from "./address.provider";
import { NFTs } from "../types/nft.type";
import { NetworkContext } from "./network.provider";
import useNFTCollectionContract from "../hooks/useNftCollectionContract.hook";
import useNftMarketContract from "../hooks/useNftMarketContract.hook";
import useNftCreateContract from "../hooks/useNftCreateContract.hook";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export const TradeTokensContext = createContext({
  tradeTokens: [] as Array<TradeTokens>,
  tradeNFTs: [] as Array<
    TradeTokens & {
      name: string;
      image: string;
      external_url: string;
      description: string;
      attributes: Array<Object>;
    }
  >,
});

export default function TradeTokensProvider({ children }: PropsWithChildren) {
  const [tradeTokens, setTradeTokens] = useState<Array<TradeTokens>>([]);
  const [tradeNFTs, setTradeNFTs] = useState<
    Array<
      TradeTokens & {
        name: string;
        image: string;
        external_url: string;
        description: string;
        attributes: Array<Object>;
      }
    >
  >([]);

  const englishAuctionContract = useEnglishAuctionContract();

  const { provider } = useContext(MetamaskContext);
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const nftCollectionContract = useNFTCollectionContract();
  const nftCreateContract = useNftCreateContract();

  useEffect(() => {
    const getTradeTokens = async (provider: MetaMaskInpageProvider) => {
      if (englishAuctionContract) {
        const tradeTokens = (await englishAuctionContract.methods
          .get_all_auctions()
          .call({
            from: address || DEFAULT_READ_WALLET,
          })) as Array<TradeTokens>;

        setTradeTokens(tradeTokens);
        console.log({ tradeTokens });
      }
    };

    if (provider) {
      getTradeTokens(provider);
    }
  }, [englishAuctionContract, address, provider]);

  useEffect(() => {
    const retrieveTradeNfts = async (tokens: Array<TradeTokens>) => {
      if (nftCollectionContract && nftCreateContract) {
        const result = [] as Array<
          TradeTokens & {
            name: string;
            image: string;
            external_url: string;
            description: string;
            attributes: Array<Object>;
          }
        >;

        const tokens_uri = (
          (await Promise.all(
            tokens.map(
              (token, index) =>
                new Promise((resolve) => {
                  (token.nft_contract ===
                  network.contracts.nftCollectionContract
                    ? nftCollectionContract
                    : nftCreateContract
                  ).methods
                    .tokenURI(token.token_id)
                    .call({ from: address || DEFAULT_READ_WALLET })
                    .then(resolve);
                })
            )
          )) as Array<string>
        ).map((uri) => uri.replace("ipfs://", "https://ipfs.io/ipfs/"));

        const tokens_details = (await Promise.all(
          tokens_uri.map(
            (uri: string, index) =>
              new Promise((resolve) => {
                fetch(uri)
                  .then((resp) => resp.json())
                  .then(resolve);
              })
          )
        )) as Array<{
          name: string;
          image: string;
          external_url: string;
          description: string;
          attributes: Array<Object>;
        }>;

        setTradeNFTs(
          tokens.map((token, index) => ({ ...token, ...tokens_details[index] }))
        );
      }
    };

    if (tradeTokens) {
      retrieveTradeNfts(tradeTokens);
    }
  }, [tradeTokens, address, network, nftCollectionContract, nftCreateContract]);

  return (
    <TradeTokensContext.Provider value={{ tradeTokens, tradeNFTs }}>
      {children}
    </TradeTokensContext.Provider>
  );
}
