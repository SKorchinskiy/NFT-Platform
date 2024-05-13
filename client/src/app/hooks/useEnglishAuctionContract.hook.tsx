"use client";

import { useContext, useEffect, useState } from "react";
import EnglishAuctionABI from "../../configs/english-auction.abi.json";
import Web3, { Contract } from "web3";
import { MetamaskContext } from "../providers/metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NetworkContext } from "../providers/network.provider";
import { AddressContext } from "../providers/address.provider";

export default function useEnglishAuctionContract() {
  const [contract, setContract] =
    useState<Contract<typeof EnglishAuctionABI>>();

  const { provider } = useContext(MetamaskContext);
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  useEffect(() => {
    const retrieveEnglishAuctionContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const english_auction_contract = new web3.eth.Contract(
        EnglishAuctionABI,
        network.contracts.englishAuctionContract,
        { from: address }
      );
      setContract(english_auction_contract);
    };

    if (provider) {
      retrieveEnglishAuctionContract(provider);
    }
  }, [provider, address, network]);

  return contract;
}
