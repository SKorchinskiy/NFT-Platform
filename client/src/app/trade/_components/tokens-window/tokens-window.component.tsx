import styles from "./tokens-window.module.css";

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
    <div className={styles["tokens-window-container"]}>
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
