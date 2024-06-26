"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AddressContext } from "./address.provider";
import { NetworkContext } from "./network.provider";
import useEnglishAuctionContract from "../hooks/useEnglishAuctionContract.hook";
import useBlindAuctionContract from "../hooks/useBlindAuctionContract.hook";
import { DEFAULT_READ_WALLET } from "@/configs/constants";

export type BlindAuction = {
  auction_id: BigInt;
  beneficiary: string;
  nft_contract: string;
  token_id: BigInt;
  auction_end_time: BigInt;
  highest_bidder: string;
  highest_bid: BigInt;
  is_blind: Boolean;
};

export type EnglishAuction = Exclude<BlindAuction, "is_blind">;

export const AuctionsContext = createContext({
  englishAuctions: [] as Array<EnglishAuction>,
  blindAuctions: [] as Array<BlindAuction>,
  refreshAuctions: () => {},
});

export default function AuctionsProvider({ children }: PropsWithChildren) {
  const [englishAuctions, setEnglishAuctions] = useState<Array<EnglishAuction>>(
    []
  );
  const [blindAuctions, setBlindAuctions] = useState<Array<BlindAuction>>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const englishAuctionContract = useEnglishAuctionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const refreshAuctions = () => setRefreshCounter((prev) => prev + 1);

  useEffect(() => refreshAuctions(), [network]);

  useEffect(() => {
    const retrieveEnglishAuctions = async () => {
      try {
        if (network && englishAuctionContract) {
          const auctions = (await englishAuctionContract.methods
            .get_all_auctions()
            .call({
              from: address || DEFAULT_READ_WALLET,
            })) as Array<EnglishAuction>;

          setEnglishAuctions(auctions);
        }
      } catch (e) {
        console.log({ e });
      }
    };

    retrieveEnglishAuctions();
  }, [address, network, englishAuctionContract, refreshCounter]);

  useEffect(() => {
    const retrieveBlindAuctions = async () => {
      try {
        if (network && blindAuctionContract) {
          const auctions = (await blindAuctionContract.methods
            .get_all_auctions()
            .call({
              from: address || DEFAULT_READ_WALLET,
            })) as Array<BlindAuction>;

          setBlindAuctions(auctions);
        }
      } catch (e) {
        console.log({ e });
      }
    };

    retrieveBlindAuctions();
  }, [address, network, blindAuctionContract, refreshCounter]);

  return (
    <AuctionsContext.Provider
      value={{ englishAuctions, blindAuctions, refreshAuctions }}
    >
      {children}
    </AuctionsContext.Provider>
  );
}
