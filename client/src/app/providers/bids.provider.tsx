"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Bid } from "../types/bid.type";
import { MetaMaskInpageProvider } from "@metamask/providers";
import useEnglishAuctionContract from "../hooks/useEnglishAuctionContract.hook";
import { AddressContext } from "./address.provider";
import { DEFAULT_READ_WALLET } from "@/configs/constants";
import {
  AuctionsContext,
  BlindAuction,
  EnglishAuction,
} from "./auctions.provider";
import useBlindAuctionContract from "../hooks/useBlindAuctionContract.hook";

export const BidsContext = createContext({
  bids: [] as Bid[],
  getSpecificAuctionBids: async (auction: BlindAuction | EnglishAuction) =>
    [] as Array<Bid>,
});

export default function BidsProvider({ children }: PropsWithChildren) {
  const [bids, setBids] = useState<Array<Bid>>([]);

  const { address } = useContext(AddressContext);

  const englishAuctionContract = useEnglishAuctionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const getSpecificAuctionBids = async (
    auction: BlindAuction | EnglishAuction
  ) => {
    console.log({ auction });
    let bids = [] as Array<Bid>;
    if (auction.is_blind && blindAuctionContract) {
      bids = (await blindAuctionContract.methods
        .get_all_auction_bids(Number(auction.auction_id))
        .call({ from: address })) as Array<Bid>;

      console.log({ blind_bids: bids });
    } else if (englishAuctionContract) {
      bids = (await englishAuctionContract.methods
        .get_all_auction_bids(auction.auction_id)
        .call({ from: address })) as Array<Bid>;
    }
    return bids;
  };

  useEffect(() => {
    const getAuctionBids = async () => {
      if (englishAuctionContract) {
        const auctions_counter = (await englishAuctionContract.methods
          .auctions_counter()
          .call({ from: address || DEFAULT_READ_WALLET })) as BigInt;

        const all_bids = (await Promise.all(
          Array.from(Array.from(Array(Number(auctions_counter)))).map(
            (_, index) =>
              new Promise((resolve) => {
                englishAuctionContract.methods
                  .get_all_auction_bids(index + 1)
                  .call({ from: address || DEFAULT_READ_WALLET })
                  .then(resolve);
              })
          )
        )) as Array<Array<Bid>>;

        setBids(
          all_bids.reduce(
            (accumulator, current_bids) => accumulator.concat(current_bids),
            []
          )
        );
      }
    };

    getAuctionBids();
  }, [address, englishAuctionContract]);

  return (
    <BidsContext.Provider value={{ bids, getSpecificAuctionBids }}>
      {children}
    </BidsContext.Provider>
  );
}
