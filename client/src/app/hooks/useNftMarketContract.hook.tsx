"use client";

import Web3, { Contract } from "web3";
import { useContext, useEffect, useState } from "react";

import { AddressContext } from "../providers/address.provider";
import { MetamaskContext } from "../providers/metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";

import MarketCreateContractABI from "../../configs/market-create.abi.json";
import { contract_addresses } from "@/configs/constants";

export default function useNftMarketContract() {
  const [marketContract, setMarketContract] =
    useState<Contract<typeof MarketCreateContractABI>>();

  const { address } = useContext(AddressContext);
  const { provider } = useContext(MetamaskContext);

  useEffect(() => {
    const retrieveNftMarketContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        MarketCreateContractABI,
        contract_addresses.marketCreateContract,
        { from: address }
      );

      setMarketContract(contract);
    };
    if (provider) {
      retrieveNftMarketContract(provider);
    }
  }, [address, provider]);

  return marketContract;
}
