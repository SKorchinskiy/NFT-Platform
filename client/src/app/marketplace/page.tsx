"use client";

import styles from "./page.module.css";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";
import NFTCardList from "../portal/_components/nft-card-list/nft-card-list.component";

import { Montserrat } from "next/font/google";
import { Status } from "../portal/_components/nft-card/nft-card.component";
import Carousel from "./_components/carousel/carousel.component";
import { CustomTokensContext } from "../providers/custom-tokens.provider";
import TradeList from "../trade/_components/trade-list/trade-list.component";
import { TradeTokensContext } from "../providers/trade-tokens.provider";

const nunito = Montserrat({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export default function MarketplacePage() {
  const {
    marketCustomTokens: customTokens,
    purchasedTokens: customPurchaseTokens,
  } = useContext(CustomTokensContext);
  const { marketTokens, purchasedTokens } = useContext(TokensContext);
  const { tradeNFTs } = useContext(TradeTokensContext);

  return (
    <div>
      <Carousel nfts={marketTokens.concat(customTokens)} />
      <div className={styles["nft-section"]}>
        <div className={styles["section-heading"]}>
          <p className={styles["section-heading-title"]}>
            <b>For sale</b>
          </p>
        </div>
        <NFTCardList
          nfts={marketTokens
            .filter(
              (token) => token.status.toString() == Status["ACTIVE"].toString()
            )
            .slice(0, 8)}
        />
      </div>
      <div className={styles["nft-section"]}>
        <div className={styles["section-heading"]}>
          <p className={styles["section-heading-title"]}>
            <b>Minted for Sale</b>
          </p>
        </div>
        <NFTCardList
          nfts={customTokens.filter((token) => {
            return Number(token.token_price) / 1e18 >= 1;
          })}
        />
      </div>
      <div className={styles["nft-section"]}>
        <div className={styles["section-heading"]}>
          <p className={styles["section-heading-title"]}>
            <b>Recently Purchased</b>
          </p>
        </div>
        <NFTCardList
          nfts={purchasedTokens
            .concat(customPurchaseTokens)
            .filter(
              (token) => token.status.toString() == Status["SOLD"].toString()
            )
            .slice(0, 8)}
        />
      </div>
      <div className={styles["nft-section"]}>
        <div className={styles["section-heading"]}>
          <p className={styles["section-heading-title"]}>
            <b>Auctions</b>
          </p>
        </div>
        <TradeList nfts={tradeNFTs.slice(0, 8)} detailed={false} />
      </div>
    </div>
  );
}
