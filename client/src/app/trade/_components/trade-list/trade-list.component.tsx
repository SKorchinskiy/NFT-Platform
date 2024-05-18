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
    }
  >;
  detailed: Boolean;
};

export default function TradeList({ nfts, detailed = true }: TradeListProps) {
  return (
    <div className={styles["trade-list-container"]}>
      {detailed
        ? nfts.map((token) => (
            <TradeCard key={Number(token.token_id)} token={token} />
          ))
        : nfts.map((token) => (
            <CompactTradeCard key={Number(token.token_id)} token={token} />
          ))}
    </div>
  );
}
