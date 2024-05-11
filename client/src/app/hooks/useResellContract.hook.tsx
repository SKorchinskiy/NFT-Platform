"use client";

import Web3 from "web3";
import { useContext, useEffect, useState } from "react";
import { MetamaskContext } from "../providers/metamask.provider";

import MarketResellABI from "../../configs/market-resell.abi.json";

import { AddressContext } from "../providers/address.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract } from "web3-eth-contract";
import { NetworkContext } from "../providers/network.provider";

export default function useResellContract() {
  const [resellContract, setResellContract] =
    useState<Contract<typeof MarketResellABI>>();

  const { provider } = useContext(MetamaskContext);
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  useEffect(() => {
    const retrieveResellContract = async (provider: MetaMaskInpageProvider) => {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(
        MarketResellABI,
        network.contracts.marketResellContract,
        {
          from: address,
          gasPrice: "20000000000",
        }
      );
      setResellContract(contract);
    };

    if (provider) {
      retrieveResellContract(provider);
    }
  }, [provider, address, network]);

  return resellContract;
}
