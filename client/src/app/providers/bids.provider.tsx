"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Bid } from "../types/bid.type";
import useEnglishAuctionContract from "../hooks/useEnglishAuctionContract.hook";
import { AddressContext } from "./address.provider";
import { DEFAULT_READ_WALLET } from "@/configs/constants";
import { BlindAuction, EnglishAuction } from "./auctions.provider";
import useBlindAuctionContract from "../hooks/useBlindAuctionContract.hook";
import { NetworkContext } from "./network.provider";

export const BidsContext = createContext({
  isLoading: false,
  bids: [] as Bid[],
  getSpecificAuctionBids: async (auction: BlindAuction | EnglishAuction) =>
    [] as Array<Bid>,
  refreshBids: () => {},
});

export default function BidsProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bids, setBids] = useState<Array<Bid>>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const refreshBids = () => setRefreshCounter((prev) => prev + 1);

  useEffect(() => refreshBids(), [network]);

  const englishAuctionContract = useEnglishAuctionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const getSpecificAuctionBids = async (
    auction: BlindAuction | EnglishAuction
  ) => {
    let bids = [] as Array<Bid>;
    try {
      setIsLoading(true);
      if (auction.is_blind && blindAuctionContract) {
        bids = (await blindAuctionContract.methods
          .get_all_auction_bids(Number(auction.auction_id))
          .call({ from: address || DEFAULT_READ_WALLET })) as Array<Bid>;
      } else if (englishAuctionContract) {
        bids = (await englishAuctionContract.methods
          .get_all_auction_bids(auction.auction_id)
          .call({ from: address || DEFAULT_READ_WALLET })) as Array<Bid>;
      }
      setIsLoading(false);
    } catch (e) {
      console.log({ e });
    } finally {
      return bids;
    }
  };

  useEffect(() => {
    const getAuctionBids = async () => {
      if (englishAuctionContract) {
        try {
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
        } catch (e) {
          console.log({ e });
        }
      }
    };

    setIsLoading(true);
    getAuctionBids();
    setIsLoading(false);
  }, [address, englishAuctionContract, refreshCounter]);

  return (
    <BidsContext.Provider
      value={{ isLoading, bids, getSpecificAuctionBids, refreshBids }}
    >
      {children}
    </BidsContext.Provider>
  );
}
