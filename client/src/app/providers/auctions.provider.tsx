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

  useEffect(() => {
    const retrieveEnglishAuctions = async () => {
      if (address && network && englishAuctionContract) {
        const auctions = (await englishAuctionContract.methods
          .get_all_auctions()
          .call({
            from: address,
          })) as Array<EnglishAuction>;

        console.log({ engAuc: auctions });

        setEnglishAuctions(auctions);
      }
    };

    retrieveEnglishAuctions();
  }, [address, network, englishAuctionContract, refreshCounter]);

  useEffect(() => {
    const retrieveBlindAuctions = async () => {
      if (address && network && blindAuctionContract) {
        const auctions = (await blindAuctionContract.methods
          .get_all_auctions()
          .call({
            from: address,
          })) as Array<BlindAuction>;

        console.log({ engAuc: auctions });

        setBlindAuctions(auctions);
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
