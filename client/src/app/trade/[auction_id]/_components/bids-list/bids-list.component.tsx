"use client";

import styles from "./bids-list.module.css";

import { Bid as BidType } from "@/app/types/bid.type";
import Bid from "../bid/bid.component";

type BidsListProps = {
  bids: Array<BidType>;
};

export default function BidsList({ bids }: BidsListProps) {
  return (
    <div className={styles["bid-list-container"]}>
      {bids.map((bid, index) => (
        <Bid key={index} bid={bid} />
      ))}
    </div>
  );
}
