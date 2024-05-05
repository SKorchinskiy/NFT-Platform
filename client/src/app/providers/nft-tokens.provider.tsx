"use client";

import {
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";
import useResellContract from "../hooks/useResellContract.hook";
import useNFTCollectionContract from "../hooks/useNftCollectionContract.hook";
import { AddressContext } from "./address.provider";
import { Contract } from "web3-eth-contract";
import NFTCollectionABI from "../../configs/nft-collection.abi.json";
import { NFT, NFTs } from "../types/nft.type";

export const TokensContext = createContext({
  marketTokens: [] as NFTs,
  tokens: [] as NFTs,
  resetTokens: (newTokens: NFTs) => {},
  removeFromMarket: (token_id: BigInt) => {},
  removeFromPersonal: (token_id: BigInt) => {},
});

// status: BigInt;
// token_holder: string;
// token_id: BigInt;
// token_price: BigInt;
// token_seller: string;

export default function NftTokensProvider({ children }: PropsWithChildren) {
  const [marketTokens, setMarketTokens] = useState<NFTs>([]);
  const [tokens, setTokens] = useState<NFTs>([]);

  const resetTokens = (newTokens: NFTs) => setTokens(newTokens);

  const { address } = useContext(AddressContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();

  const removeFromMarket = (token_id: BigInt) =>
    setMarketTokens((prevState) =>
      prevState.filter((token) => token.token_id !== token_id)
    );

  const removeFromPersonal = (token_id: BigInt) =>
    setTokens((prevState) =>
      prevState.filter((token) => token.token_id !== token_id)
    );

  useEffect(() => {
    const getPersonalTokens = async (
      address: string,
      nftCollectionContract: Contract<typeof NFTCollectionABI>
    ) => {
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
    };

    if (address && nftCollectionContract)
      getPersonalTokens(address, nftCollectionContract);
  }, [address, nftCollectionContract, marketTokens]);

  useEffect(() => {
    const getMarketNftTokens = async () => {
      if (address && resellContract && nftCollectionContract) {
        const tokens = (
          (await resellContract.methods
            .get_listed_nft()
            .call({ from: address })) as Array<{
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
            .call({ from: address })) as string;
          const ipfsURI = tokenURI.replace("ipfs://", `https://ipfs.io/ipfs/`);

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
    };

    getMarketNftTokens();
  }, [address, nftCollectionContract, resellContract, tokens]);

  return (
    <TokensContext.Provider
      value={{
        marketTokens,
        tokens,
        resetTokens,
        removeFromMarket,
        removeFromPersonal,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}
