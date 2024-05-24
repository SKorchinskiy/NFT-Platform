"use client";

import styles from "./trade-list.module.css";

import { TradeTokens } from "@/app/types/trade-tokens.type";
import TradeCard from "../trade-card/trade-card.component";
import CompactTradeCard from "../compact-trade-card/compact-trade-card.component";

type TradeListProps = {
  nfts: Array<
    TradeTokens & {
      name: string;
      image: string;
      external_url: string;
      description: string;
      attributes: Array<Object>;
    } & { mappedAuctionId: number }
  >;
  detailed: Boolean;
};

export default function TradeList({ nfts, detailed = true }: TradeListProps) {
  return (
    <div className={styles["trade-list-container"]}>
      {detailed
        ? nfts.map((token, index) => <TradeCard key={index} token={token} />)
        : nfts.map((token, index) => (
            <CompactTradeCard key={index} token={token} />
          ))}
    </div>
  );
}
