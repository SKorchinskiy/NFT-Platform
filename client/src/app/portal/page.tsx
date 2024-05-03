"use client";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";

import NFTCardList from "./_components/nft-card-list/nft-card-list.component";

export default function Portal() {
  const { tokens } = useContext(TokensContext);

  return tokens ? (
    <div
      style={{
        position: "relative",
      }}
    >
      <NFTCardList nfts={tokens} />
    </div>
  ) : null;
}
