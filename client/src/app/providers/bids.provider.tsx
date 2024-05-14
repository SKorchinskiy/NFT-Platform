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

export const BidsContext = createContext({
  bids: [] as Bid[],
});

export default function BidsProvider({ children }: PropsWithChildren) {
  const [bids, setBids] = useState<Array<Bid>>([]);

  const { address } = useContext(AddressContext);

  const englishAuctionContract = useEnglishAuctionContract();

  useEffect(() => {
    const getAuctionBids = async () => {
      if (address && englishAuctionContract) {
        const auctions_counter = (await englishAuctionContract.methods
          .auctions_counter()
          .call({
            from: address,
          })) as BigInt;

        console.log({ auctions_counter });

        const all_bids = (await Promise.all(
          Array.from(Array.from(Array(Number(auctions_counter)))).map(
            (_, index) =>
              new Promise((resolve) => {
                englishAuctionContract.methods
                  .get_all_auction_bids(index + 1)
                  .call({ from: address })
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
    <BidsContext.Provider value={{ bids }}>{children}</BidsContext.Provider>
  );
}
