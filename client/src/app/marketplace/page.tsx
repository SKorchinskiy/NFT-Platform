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
import NftSection from "./_components/nft-section/nft-section.component";

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

  const activeMintedTokens = useMemo(() => {
    return customTokens.filter(
      (token) => Number(token.token_price) / 1e18 >= 1
    );
  }, [customTokens]);

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
    <div className={styles["marketplace-container"]}>
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      carouselTokens.length >= 3 ? (
        <Carousel nfts={carouselTokens} />
      ) : null}
      {isTokensDataLoading || activeTokens.length ? (
        <NftSection heading="For sale">
          <NFTCardList nfts={activeTokens} />
        </NftSection>
      ) : null}
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      activeMintedTokens.length ? (
        <NftSection heading="Minted for Sale">
          <NFTCardList nfts={activeMintedTokens} />
        </NftSection>
      ) : null}
      {isTokensDataLoading ||
      isCustomTokensDataLoading ||
      recentlyPurchased.length ? (
        <NftSection heading="Recently Purchased">
          <NFTCardList nfts={recentlyPurchased} />
        </NftSection>
      ) : null}
      {isTradeTokensDataLoading || tradeNFTs.length ? (
        <NftSection heading={"Auctions"}>
          <TradeList nfts={tradeNFTs} detailed={false} />
        </NftSection>
      ) : null}
    </div>
  );
}
