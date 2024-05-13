import NFTCardList from "@/app/portal/_components/nft-card-list/nft-card-list.component";
import NFTCard from "@/app/portal/_components/nft-card/nft-card.component";
import { CustomTokensContext } from "@/app/providers/custom-tokens.provider";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { useContext, useMemo, useState } from "react";
import NftTradeCard from "../nft-trade-card/nft-trade-card.component";
import { NFT } from "@/app/types/nft.type";

export default function TokensWindow({
  nftForTrade,
  selectedNftHandler,
}: {
  nftForTrade: NFT;
  selectedNftHandler: (nft: NFT) => void;
}) {
  const { tokens } = useContext(TokensContext);
  const { addressCustomTokens } = useContext(CustomTokensContext);

  const ownedTokens = useMemo(
    () => tokens.concat(addressCustomTokens),
    [tokens, addressCustomTokens]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 200px)",
        columnGap: 10,
        rowGap: 10,
        minHeight: 200,
        maxHeight: 500,
        overflow: "scroll",
        background: "red",
        width: 620,
        padding: 25,
        borderRadius: 5,
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      {ownedTokens.map((token) => (
        <NftTradeCard
          key={Number(token.token_id)}
          nft={token}
          nftForTrade={nftForTrade}
          selectedNftHandler={selectedNftHandler}
        />
      ))}
    </div>
  );
}
