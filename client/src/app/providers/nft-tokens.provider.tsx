"use client";

import {
  PropsWithChildren,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";
import { NFTs } from "../portal/_components/nft-card-list/nft-card-list.component";
import useResellContract from "../hooks/useResellContract.hook";
import useNFTCollectionContract from "../hooks/useNftCollectionContract.hook";
import { AddressContext } from "./address.provider";
import { Contract } from "web3-eth-contract";
import NFTCollectionABI from "../../configs/nft-collection.abi.json";

export const TokensContext = createContext({
  allTokens: [] as NFTs,
  tokens: [] as NFTs,
  resetTokens: (newTokens: NFTs) => {},
});

type NFT = {
  status: BigInt;
  token_holder: string;
  token_id: BigInt;
  token_price: BigInt;
  token_seller: string;
};

export default function NftTokensProvider({ children }: PropsWithChildren) {
  const [allTokens, setAllTokens] = useState<NFTs>([]);
  const [tokens, setTokens] = useState<NFTs>([]);

  const resetTokens = (newTokens: NFTs) => setTokens(newTokens);

  const { address } = useContext(AddressContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();

  useEffect(() => {
    const getPersonalTokens = async (
      address: string,
      nftCollectionContract: Contract<typeof NFTCollectionABI>
    ) => {
      const ownedTokensId: Array<BigInt> = await nftCollectionContract.methods
        .walletOfOwner(address)
        .call({
          from: address,
        });

      const ownedTokensURIs: Array<{ tokenURI: string; tknId: BigInt }> = (
        (await Promise.all(
          ownedTokensId.map((tokenId) =>
            nftCollectionContract.methods.tokenURI(tokenId).call({
              from: address,
            })
          )
        )) || []
      ).map((tokenURI, index) =>
        typeof tokenURI == "string"
          ? { tokenURI: tokenURI, tknId: ownedTokensId[index] }
          : { tokenURI: "", tknId: BigInt(0) }
      );
      const tokens_data: NFTs = [];
      let index = 0;
      for (const { tokenURI, tknId } of ownedTokensURIs) {
        const ipfsURI = tokenURI.replace("ipfs://", `https://ipfs.io/ipfs/`);
        const data = await (await fetch(ipfsURI)).json();
        data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);
        console.log({ data });
        const token_metadata = {
          ...data,
          token_id: index++,
          tknId,
        };
        tokens_data.push(token_metadata);
      }

      setTokens(tokens_data);
    };

    if (address && nftCollectionContract)
      getPersonalTokens(address, nftCollectionContract);
  }, [address, nftCollectionContract]);

  useEffect(() => {
    const fetchNftTokens = async () => {
      if (address && resellContract && nftCollectionContract) {
        const tokens = (
          (await resellContract.methods
            .get_listed_nft()
            .call({ from: address })) as Array<NFT>
        )
          .map((token: NFT, index: number) => ({ ...token, tokenId: index }))
          .filter((token) => Number(token.token_price).toString() != "0");
        let tokens_data: NFTs = [];
        let index = 0;
        for (let token of tokens) {
          const tokenURI = (await nftCollectionContract.methods
            .tokenURI(token.token_id)
            .call({
              from: address,
            })) as string;
          const ipfsURI = tokenURI.replace("ipfs://", `https://ipfs.io/ipfs/`);
          const data = await (await fetch(ipfsURI)).json();
          data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);
          const token_metadata = {
            ...data,
            ...token,
            token_id: index++,
            tknId: token.token_id,
          };
          tokens_data.push(token_metadata);
        }
        setAllTokens(tokens_data);
      }
    };

    fetchNftTokens();
  }, [address, nftCollectionContract, resellContract]);

  return (
    <TokensContext.Provider
      value={{
        allTokens,
        tokens,
        resetTokens,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
}
