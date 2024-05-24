"use client";

import {
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
} from "react";
import useResellContract from "../hooks/useResellContract.hook";
import useNFTCollectionContract from "../hooks/useNftCollectionContract.hook";
import { AddressContext } from "./address.provider";
import { Contract } from "web3-eth-contract";
import NFTCollectionABI from "../../configs/nft-collection.abi.json";
import { NFT, NFTs } from "../types/nft.type";
import { DEFAULT_READ_WALLET } from "@/configs/constants";
import { Status } from "../portal/_components/nft-card/nft-card.component";
import { CustomTokensContext } from "./custom-tokens.provider";
import { NetworkContext } from "./network.provider";

export const TokensContext = createContext({
  isLoading: false,
  tokens: [] as NFTs,
  marketTokens: [] as NFTs,
  purchasedTokens: [] as NFTs,
  addressSoldTokens: [] as NFTs,
  resetTokens: (newTokens: NFTs) => {},
  refreshTokens: () => {},
});

export default function NftTokensProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [marketTokens, setMarketTokens] = useState<NFTs>([]);
  const [purchasedTokens, setPurchasedTokens] = useState<NFTs>([]);
  const [tokens, setTokens] = useState<NFTs>([]);

  const [refreshCounter, setRefreshCounter] = useState(0);

  const { network } = useContext(NetworkContext);

  const refreshTokens = () => setRefreshCounter((prev) => prev + 1);

  const resetTokens = (newTokens: NFTs) => setTokens(newTokens);

  const { address } = useContext(AddressContext);
  const { purchasedTokens: customPurchaseTokens } =
    useContext(CustomTokensContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();

  const addressSoldTokens = useMemo(
    () =>
      purchasedTokens
        .concat(customPurchaseTokens)
        .filter(
          (token) =>
            token.token_seller == address &&
            token.status.toString() == Status["SOLD"].toString()
        ),
    [purchasedTokens, address, customPurchaseTokens]
  );

  useEffect(() => refreshTokens(), [network]);

  useEffect(() => {
    const getPurchasedTokens = async () => {
      try {
        setIsLoading(true);
        if (resellContract && nftCollectionContract) {
          const purchasedTokensData = (await resellContract.methods
            .get_purchased_tokens()
            .call({ from: address || DEFAULT_READ_WALLET })) as Array<{
            status: BigInt;
            token_holder: string;
            token_id: BigInt;
            token_price: BigInt;
            token_seller: string;
          }>;

          const tokens_data = [] as NFTs;
          for (const token of purchasedTokensData) {
            const tokenURI = (await nftCollectionContract.methods
              .tokenURI(token.token_id)
              .call({ from: address || DEFAULT_READ_WALLET })) as string;
            const ipfsURI = tokenURI.replace(
              "ipfs://",
              `https://ipfs.io/ipfs/`
            );

            const data = (await (await fetch(ipfsURI)).json()) as {
              attributes: Array<Object>;
              description: string;
              external_url: string;
              image: string;
              name: string;
            };
            data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);

            tokens_data.push({ ...data, ...token });
          }

          setPurchasedTokens(tokens_data);
        }
      } catch (e) {
        console.log({ e });
      } finally {
        setIsLoading(false);
      }
    };

    getPurchasedTokens();
  }, [
    resellContract,
    nftCollectionContract,
    address,
    marketTokens,
    refreshCounter,
  ]);

  useEffect(() => {
    const getPersonalTokens = async (
      address: string,
      nftCollectionContract: Contract<typeof NFTCollectionABI>
    ) => {
      try {
        setIsLoading(true);
        const ownedTokensId: Array<BigInt> = await nftCollectionContract.methods
          .walletOfOwner(address)
          .call({ from: address });

        const ownedTokenData: Array<{ tokenURI: string; token_id: number }> = (
          (await Promise.all(
            ownedTokensId.map((tokenId) =>
              nftCollectionContract.methods.tokenURI(tokenId).call({
                from: address,
              })
            )
          )) || []
        ).map((tokenURI, index) =>
          typeof tokenURI == "string"
            ? { tokenURI, token_id: Number(ownedTokensId[index]) }
            : { tokenURI: "", token_id: 0 }
        );

        const tokens_data: NFTs = [];
        for (const { tokenURI, token_id } of ownedTokenData) {
          const ipfsURI = tokenURI.replace("ipfs://", `https://ipfs.io/ipfs/`);
          const data = (await (await fetch(ipfsURI)).json()) as {
            attributes: Array<Object>;
            description: string;
            external_url: string;
            image: string;
            name: string;
          };
          data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);
          const token_metadata = {
            ...data,
            token_seller: address,
            token_price: BigInt(0),
            token_holder: address,
            status: BigInt(0),
            token_id: BigInt(token_id),
          } as NFT;
          tokens_data.push(token_metadata);
        }

        setTokens(tokens_data);
      } catch (e) {
        console.log({ e });
      } finally {
        setIsLoading(false);
      }
    };

    if (address && nftCollectionContract)
      getPersonalTokens(address, nftCollectionContract);
  }, [address, nftCollectionContract, refreshCounter]);

  useEffect(() => {
    const getMarketNftTokens = async () => {
      setIsLoading(true);
      try {
        if (resellContract && nftCollectionContract) {
          console.log("getting, market nft");
          const tokens = (
            (await resellContract.methods
              .get_listed_nft()
              .call({ from: address || DEFAULT_READ_WALLET })) as Array<{
              status: BigInt;
              token_holder: string;
              token_id: BigInt;
              token_price: BigInt;
              token_seller: string;
            }>
          ).filter((token) => Number(token.token_price).toString() != "0");

          const tokens_data: NFTs = [];

          for (const token of tokens) {
            const tokenURI = (await nftCollectionContract.methods
              .tokenURI(token.token_id)
              .call({ from: address || DEFAULT_READ_WALLET })) as string;
            const ipfsURI = tokenURI.replace(
              "ipfs://",
              `https://ipfs.io/ipfs/`
            );

            const data = (await (await fetch(ipfsURI)).json()) as {
              attributes: Array<Object>;
              description: string;
              external_url: string;
              image: string;
              name: string;
            };
            data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);

            tokens_data.push({ ...data, ...token });
          }

          setMarketTokens(tokens_data);
        }
      } catch (e) {
        console.log({ e });
      } finally {
        setIsLoading(false);
      }
    };

    getMarketNftTokens();
  }, [address, nftCollectionContract, resellContract, refreshCounter]);

  return (
    <TokensContext.Provider
      value={{
        isLoading,
        tokens,
        marketTokens,
        purchasedTokens,
        addressSoldTokens,
        resetTokens,
        refreshTokens,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}
