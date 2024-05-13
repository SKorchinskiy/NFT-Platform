"use client";

import { TradeTokens } from "@/app/types/trade-tokens.type";
import TradeCard from "../trade-card/trade-card.component";

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
};

export default function TradeList({ nfts }: TradeListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: 50,
        rowGap: 50,
        width: "100%",
      }}
    >
      {nfts.map((token) => (
        <TradeCard key={Number(token.token_id)} token={token} />
      ))}
    </div>
  );
}
