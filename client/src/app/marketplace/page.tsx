"use client";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";
import NFTCardList from "../portal/_components/nft-card-list/nft-card-list.component";

export default function MarketplacePage() {
  const { allTokens } = useContext(TokensContext);

  return <NFTCardList nfts={allTokens} />;
}
