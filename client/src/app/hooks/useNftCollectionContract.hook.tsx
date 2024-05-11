"use client";

import Web3 from "web3";
import { useContext, useEffect, useState } from "react";
import { MetamaskContext } from "../providers/metamask.provider";

import NFTCollectionABI from "../../configs/nft-collection.abi.json";

import { AddressContext } from "../providers/address.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract } from "web3-eth-contract";
import { NetworkContext } from "../providers/network.provider";

export default function useNFTCollectionContract() {
  const [nftCollectionContract, setNftCollectionContract] =
    useState<Contract<typeof NFTCollectionABI>>();

  const { provider } = useContext(MetamaskContext);
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  useEffect(() => {
    const retrieveNftCollectionContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        NFTCollectionABI,
        network.contracts.nftCollectionContract,
        {
          from: address,
        }
      );
      setNftCollectionContract(contract);
    };

    if (provider) {
      retrieveNftCollectionContract(provider);
    }
  }, [provider, address, network]);

  return nftCollectionContract;
}
