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

  return (
    <div className={styles["bid-list-container"]}>
      <div>
        <span>Bid History</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 50,
          width: "400px",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: 20,
        }}
      >
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              bottom: 10,
            }}
          >
            <span>is fake ?</span>
            <input
              type="checkbox"
              onChange={(e) => setIsFakeBid(e.target.checked)}
            />
          </div>
        ) : null}
        <div>
          <button
            onClick={async () => {
              if (englishAuctionContract && blindAuctionContract) {
                if (target_auction.is_blind) {
                  console.log({ target_auction, isFakeBid, bidAmount });
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
              }
            }}
            style={{
              cursor: "pointer",
              padding: 5,
              width: 100,
            }}
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
