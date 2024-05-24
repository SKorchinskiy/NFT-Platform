"use client";

import { useContext, useEffect, useState } from "react";
import BlindAuctionABI from "../../configs/blind-auction.abi.json";
import Web3, { Contract } from "web3";
import { AddressContext } from "../providers/address.provider";
import { NetworkContext } from "../providers/network.provider";
import { MetamaskContext } from "../providers/metamask.provider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export default function useBlindAuctionContract() {
  const [contract, setContract] = useState<Contract<typeof BlindAuctionABI>>();

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);
  const { provider } = useContext(MetamaskContext);

  useEffect(() => {
    const retrieveBlindAuctionContract = async (
      provider: MetaMaskInpageProvider
    ) => {
      const web3 = new Web3(provider);
      const blind_auction_contract = new web3.eth.Contract(
        BlindAuctionABI,
        network.contracts.blindAuctionContract,
        { from: address || DEFAULT_READ_WALLET }
      );
      setContract(blind_auction_contract);
    };

    if (provider && network) {
      retrieveBlindAuctionContract(provider);
    }
  }, [address, network, provider]);

  return contract;
}
