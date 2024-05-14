"use client";

import { Bid as BidType } from "@/app/types/bid.type";
import Bid from "../bid/bid.component";

type BidsListProps = {
  bids: Array<BidType>;
};

export default function BidsList({ bids }: BidsListProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: 10,
        rowGap: 10,
        height: 500,
        overflow: "scroll",
        background: "rgba(0, 0, 0, 0.4)",
        padding: 10,
        borderRadius: 5,
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {bids.map((bid, index) => (
        <Bid key={index} bid={bid} />
      ))}
    </div>
  );
}
