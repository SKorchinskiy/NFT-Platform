"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { NFT, NFTs } from "../types/nft.type";

import { AddressContext } from "./address.provider";

import useNftMarketContract from "../hooks/useNftMarketContract.hook";
import useNftCreateContract from "../hooks/useNftCreateContract.hook";
import { NetworkContext } from "./network.provider";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export const CustomTokensContext = createContext({
  purchasedTokens: [] as NFTs,
  marketCustomTokens: [] as NFTs,
  addressCustomTokens: [] as NFTs,
});

export default function CustomTokensProvider({ children }: PropsWithChildren) {
  const [purchasedTokens, setPurchasedTokens] = useState<NFTs>([]);
  const [marketCustomTokens, setMarketCustomTokens] = useState<NFTs>([]);
  const [addressCustomTokens, setAddressCustomTokens] = useState<NFTs>([]);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const nftCreateContract = useNftCreateContract();
  const marketCreateContract = useNftMarketContract();

  useEffect(() => {
    const getPurchasedTokens = async () => {
      try {
        if (nftCreateContract && marketCreateContract) {
          const purchasedTokensData = (await marketCreateContract.methods
            .get_purchase_history()
            .call({ from: address || DEFAULT_READ_WALLET })) as Array<{
            status: BigInt;
            token_holder: string;
            token_id: BigInt;
            token_price: BigInt;
            token_seller: string;
          }>;

          const tokens_data = [] as NFTs;
          for (const token of purchasedTokensData) {
            const tokenURI = (await nftCreateContract.methods
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
      }
    };

    getPurchasedTokens();
  }, [address, nftCreateContract, marketCreateContract]);

  useEffect(() => {
    const retrieveAddressCustomTokens = async () => {
      if (address && nftCreateContract) {
        const tokens_count = Number(
          (await nftCreateContract.methods
            .counter()
            .call({ from: address })) as BigInt
        );

        const owned_tokens_ids =
          (
            await Promise.all(
              Array.from(Array(tokens_count)).map(
                (_, index) =>
                  new Promise((resolve) => {
                    (
                      nftCreateContract.methods
                        .ownerOf(index + 1)
                        .call({ from: address }) as Promise<string>
                    ).then((token_owner: string) => {
                      resolve(token_owner === address ? index + 1 : -1);
                    });
                  }) as Promise<number>
              )
            )
          ).filter((value) => value !== -1) || ([] as Array<number>);
        const tokens_data: NFTs = (await Promise.all(
          owned_tokens_ids.map(
            (token_id) =>
              new Promise(async (resolve) => {
                const token_ipfs_uri = (await nftCreateContract.methods
                  .tokenURI(token_id)
                  .call({ from: address })) as string;
                const response = await fetch(
                  token_ipfs_uri.replace("ipfs://", "https://ipfs.io/ipfs/")
                );
                const token_data = (await response.json()) as {
                  name: string;
                  description: string;
                  image: string;
                };
                resolve({
                  ...token_data,
                  token_id: BigInt(token_id),
                  attributes: [] as Array<Object>,
                  external_url: "",
                  status: BigInt(0),
                  token_holder: address,
                  token_seller: address,
                  image: token_data.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  ),
                  token_price: BigInt(0),
                  nft_contract: network.contracts.nftCreateContract,
                } as NFT);
              })
          )
        )) as NFTs;

        setAddressCustomTokens(tokens_data);
      }
    };

    retrieveAddressCustomTokens();
  }, [address, nftCreateContract, network]);

  useEffect(() => {
    const retrieveCustomMarketTokens = async () => {
      if (nftCreateContract) {
        if (marketCreateContract) {
          const listed_custom_tokens = (
            (await marketCreateContract.methods.get_all_available_nfts().call({
              from: address || DEFAULT_READ_WALLET,
            })) || []
          ).map(
            (token: {
              token_holder: string;
              token_id: BigInt;
              token_price: BigInt;
              token_seller: string;
              status: BigInt;
            }) => ({
              ...token,
              status: token.status,
              attributes: [],
              external_url: "",
            })
          );

          const tokens_data = [] as NFTs;

          for (let iter = 0; iter < listed_custom_tokens.length; iter++) {
            const token_id = Number(listed_custom_tokens[iter].token_id);
            const token_ipfs_uri = (await nftCreateContract.methods
              .tokenURI(token_id)
              .call({ from: address || DEFAULT_READ_WALLET })) as string;
            const response = await fetch(
              token_ipfs_uri.replace("ipfs://", "https://ipfs.io/ipfs/")
            );

            const token_data = (await response.json()) as {
              name: string;
              description: string;
              image: string;
              token_price: string;
            };

            tokens_data.push({
              ...token_data,
              ...listed_custom_tokens[iter],
              image: token_data.image.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              ),
            });
          }

          setMarketCustomTokens(tokens_data);
        }
      }
    };

    retrieveCustomMarketTokens();
  }, [address, nftCreateContract, marketCreateContract]);

  return (
    <CustomTokensContext.Provider
      value={{ purchasedTokens, marketCustomTokens, addressCustomTokens }}
    >
      {children}
    </CustomTokensContext.Provider>
  );
}
