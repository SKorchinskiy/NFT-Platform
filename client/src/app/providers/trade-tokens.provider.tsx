"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
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
import { AuctionsContext } from "./auctions.provider";

export const TradeTokensContext = createContext({
  isLoading: false,
  tradeTokens: [] as Array<TradeTokens>,
  tradeNFTs: [] as Array<
    TradeTokens & {
      name: string;
      image: string;
      external_url: string;
      description: string;
      attributes: Array<Object>;
    } & { mappedAuctionId: number }
  >,
  auctionsMapper: { blind: {}, english: {} } as {
    [key: string]: {
      [key2: number]: number;
    };
  },
});

export default function TradeTokensProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [tradeNFTs, setTradeNFTs] = useState<
    Array<
      TradeTokens & {
        name: string;
        image: string;
        external_url: string;
        description: string;
        attributes: Array<Object>;
      } & { mappedAuctionId: number }
    >
  >([]);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const nftCollectionContract = useNFTCollectionContract();
  const nftCreateContract = useNftCreateContract();

  const { blindAuctions, englishAuctions } = useContext(AuctionsContext);
  const tradeTokens = useMemo(
    () => [...blindAuctions, ...englishAuctions] as Array<TradeTokens>,
    [blindAuctions, englishAuctions]
  );

  console.log({ tradeTokens });

  const auctionsMapper = useMemo(() => {
    const res = { english: {}, blind: {} } as {
      [key: string]: {
        [key2: number]: number;
      };
    };
    let id = 1;
    tradeTokens.forEach((token) => {
      if (token.is_blind) {
        res.blind[Number(token.auction_id)] = id++;
      } else {
        res.english[Number(token.auction_id)] = id++;
      }
    });
    return { ...res };
  }, [tradeTokens]);

  useEffect(() => {
    const retrieveTradeNfts = async (tokens: Array<TradeTokens>) => {
      try {
        setIsLoading(true);
        if (nftCollectionContract && nftCreateContract) {
          console.log("brrrrrrrr");
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
                      .then(resolve)
                      .catch(console.log);
                  })
              )
            )) as Array<string>
          ).map((uri) => uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
          console.log("arrrrrrrr");

          console.log({ tokens_uri });

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
            tokens.map((token, index) => ({
              ...token,
              ...tokens_details[index],
              mappedAuctionId:
                auctionsMapper[token.is_blind ? "blind" : "english"][
                  Number(token.auction_id)
                ],
            }))
          );
        }
      } catch (e) {
        console.log({ e });
      } finally {
        setIsLoading(false);
      }
    };
    console.log("outer retr...");
    if (tradeTokens && auctionsMapper) {
      console.log("inner retr...", { tradeTokens });
      retrieveTradeNfts(tradeTokens);
    }
  }, [
    tradeTokens,
    address,
    network,
    nftCollectionContract,
    nftCreateContract,
    auctionsMapper,
  ]);

  return (
    <TradeTokensContext.Provider
      value={{ isLoading, tradeTokens, tradeNFTs, auctionsMapper }}
    >
      {children}
    </TradeTokensContext.Provider>
  );
}
