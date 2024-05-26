"use client";

import Web3, { Contract } from "web3";
import { useContext, useEffect, useState } from "react";

import { AddressContext } from "../providers/address.provider";
import { MetamaskContext } from "../providers/metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";

import MarketCreateContractABI from "../../configs/market-create.abi.json";
import { NetworkContext } from "../providers/network.provider";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export default function useNftMarketContract() {
  const [marketContract, setMarketContract] =
    useState<Contract<typeof MarketCreateContractABI>>();

  const { network } = useContext(NetworkContext);
  const { address } = useContext(AddressContext);
  const { provider } = useContext(MetamaskContext);

  useEffect(() => {
    const retrieveNftMarketContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        MarketCreateContractABI,
        network.contracts.marketCreateContract,
        { from: address || DEFAULT_READ_WALLET }
      );
      setMarketContract(contract);
    };
    if (provider && network) {
      retrieveNftMarketContract(provider);
    }
  }, [address, provider, network]);

  return marketContract;
}
