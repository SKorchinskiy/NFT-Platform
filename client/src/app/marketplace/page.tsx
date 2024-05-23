"use client";

import styles from "./page.module.css";

import { Fragment, useContext, useMemo } from "react";
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
    isLoading: isCustomTokensDataLoading,
    marketCustomTokens: customTokens,
    purchasedTokens: customPurchaseTokens,
  } = useContext(CustomTokensContext);
  const {
    isLoading: isTokensDataLoading,
    marketTokens,
    purchasedTokens,
  } = useContext(TokensContext);
  const { isLoading: isTradeTokensDataLoading, tradeNFTs } =
    useContext(TradeTokensContext);

  const carouselTokens = useMemo(
    () => marketTokens.concat(customTokens),
    [marketTokens, customTokens]
  );

  const activeTokens = useMemo(
    () =>
      marketTokens.filter(
        (token) => token.status.toString() == Status["ACTIVE"].toString()
      ),
    [marketTokens]
  );

  const activeMintedTokens = useMemo(
    () =>
      customTokens.filter((token) => {
        return Number(token.token_price) / 1e18 >= 1;
      }),
    []
  );

  const recentlyPurchased = useMemo(
    () =>
      purchasedTokens
        .concat(customPurchaseTokens)
        .filter(
          (token) => token.status.toString() == Status["SOLD"].toString()
        ),
    [purchasedTokens, customPurchaseTokens]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      carouselTokens.length >= 3 ? (
        <Carousel nfts={carouselTokens} />
      ) : null}
      {isTokensDataLoading || activeTokens.length ? (
        <Fragment>
          <div className={styles["nft-section"]}>
            <div className={styles["section-heading"]}>
              <p className={styles["section-heading-title"]}>
                <b>For sale</b>
              </p>
            </div>
            <NFTCardList nfts={activeTokens} />
          </div>
        </Fragment>
      ) : null}
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      activeMintedTokens.length ? (
        <div className={styles["nft-section"]}>
          <div className={styles["section-heading"]}>
            <p className={styles["section-heading-title"]}>
              <b>Minted for Sale</b>
            </p>
          </div>
          <NFTCardList nfts={activeMintedTokens} />
        </div>
      ) : null}
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      recentlyPurchased.length ? (
        <div className={styles["nft-section"]}>
          <div className={styles["section-heading"]}>
            <p className={styles["section-heading-title"]}>
              <b>Recently Purchased</b>
            </p>
          </div>
          <NFTCardList nfts={recentlyPurchased} />
        </div>
      ) : null}
      {isTradeTokensDataLoading || tradeNFTs.length ? (
        <div className={styles["nft-section"]}>
          <div className={styles["section-heading"]}>
            <p className={styles["section-heading-title"]}>
              <b>Auctions</b>
            </p>
          </div>
          <TradeList nfts={tradeNFTs} detailed={false} />
        </div>
      ) : null}
    </div>
  );
}
