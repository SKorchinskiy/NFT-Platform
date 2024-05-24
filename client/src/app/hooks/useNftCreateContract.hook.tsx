"use client";

import { useContext, useEffect, useState } from "react";

import Web3, { Contract } from "web3";

import { AddressContext } from "../providers/address.provider";
import { MetamaskContext } from "../providers/metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";

import NftCreateContractABI from "../../configs/market-nft-create.abi.json";
import { NetworkContext } from "../providers/network.provider";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export default function useNftCreateContract() {
  const [nftCreateContract, setNftCreateContract] =
    useState<Contract<typeof NftCreateContractABI>>();

  const { network } = useContext(NetworkContext);
  const { address } = useContext(AddressContext);
  const { provider } = useContext(MetamaskContext);

  useEffect(() => {
    const retrieveNftCreateContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        NftCreateContractABI,
        network.contracts.nftCreateContract,
        { from: address || DEFAULT_READ_WALLET }
      );

      setNftCreateContract(contract);
    };

    if (provider && network) {
      retrieveNftCreateContract(provider);
    }
  }, [address, provider, network]);

  return nftCreateContract;
}
