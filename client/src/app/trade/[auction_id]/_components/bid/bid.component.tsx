"use client";

import { NetworkContext } from "@/app/providers/network.provider";
import { Bid as BidType } from "@/app/types/bid.type";
import { useContext } from "react";

type BidProps = {
  bid: BidType;
};

export default function Bid({ bid }: BidProps) {
  const { network } = useContext(NetworkContext);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "whitesmoke",
        color: "black",
        width: 500,
        borderRadius: 5,
        margin: "auto",
        padding: 20,
      }}
    >
      <p>Bidder: </p>
      <p>{bid.bidder}</p>
      <p>Deposit: </p>
      <p>
        {Number(bid.deposit) / 1e18} {network.symbol}
      </p>
    </div>
  );
}
