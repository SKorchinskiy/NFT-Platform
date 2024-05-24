"use client";

import styles from "./bids-list.module.css";

import { Bid as BidType } from "@/app/types/bid.type";
import Bid from "../bid/bid.component";
import useEnglishAuctionContract from "@/app/hooks/useEnglishAuctionContract.hook";
import { useContext, useMemo, useState } from "react";
import { AddressContext } from "@/app/providers/address.provider";
import useBlindAuctionContract from "@/app/hooks/useBlindAuctionContract.hook";
import {
  AuctionsContext,
  BlindAuction,
  EnglishAuction,
} from "@/app/providers/auctions.provider";
import { BidsContext } from "@/app/providers/bids.provider";

type BidsListProps = {
  bids: Array<BidType>;
  target_auction: BlindAuction | EnglishAuction;
};

export default function BidsList({ bids, target_auction }: BidsListProps) {
  const [bidAmount, setBidAmount] = useState("0");
  const [isFakeBid, setIsFakeBid] = useState(false);
  const { address } = useContext(AddressContext);

  const englishAuctionContract = useEnglishAuctionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const { refreshBids } = useContext(BidsContext);

  const submitBidHandler = async () => {
    if (englishAuctionContract && blindAuctionContract) {
      try {
        if (target_auction.is_blind) {
          await blindAuctionContract.methods
            .bid(target_auction.auction_id, isFakeBid)
            .send({
              from: address,
              value: bidAmount,
            });
        } else {
          await englishAuctionContract.methods
            .bid(target_auction.auction_id)
            .send({
              from: address,
              value: bidAmount,
            });
        }
        refreshBids();
      } catch (e) {
        console.log({ e });
      }
    }
  };

  return (
    <div className={styles["bid-list-container"]}>
      <div className={styles["bid-list-header"]}>
        <span>Bid History</span>
      </div>
      <div className={styles["bid-list-content"]}>
        <div>
          <span>Bid amount: </span>
        </div>
        <div>
          <input
            type="number"
            onChange={(e) =>
              setBidAmount(
                Number(+e.target.value).toString() + "000000000000000000"
              )
            }
          />
        </div>
        {target_auction.is_blind ? (
          <div className={styles["blind-auction-options"]}>
            <span>is fake ?</span>
            <input
              type="checkbox"
              onChange={(e) => setIsFakeBid(e.target.checked)}
            />
          </div>
        ) : null}
        <div>
          <button
            onClick={() => submitBidHandler()}
            className={styles["bid-button"]}
          >
            Place Bid
          </button>
        </div>
      </div>
      <div className={styles["bid-list"]}>
        {bids.map((bid, index) => (
          <Bid key={index} bid={bid} />
        ))}
      </div>
    </div>
  );
}
