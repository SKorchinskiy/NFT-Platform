"use client";

import styles from "./page.module.css";

import { Fragment, useContext, useMemo } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";

import NFTCardList from "./_components/nft-card-list/nft-card-list.component";

import { Montserrat } from "next/font/google";
import { Status } from "./_components/nft-card/nft-card.component";
import { AddressContext } from "../providers/address.provider";
import { CustomTokensContext } from "../providers/custom-tokens.provider";
import ConnectWallet from "../_components/connect-wallet/connect-wallet.component";

const nunito = Montserrat({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export default function Portal() {
  const { address } = useContext(AddressContext);
  const {
    isLoading: isCustomTokensDataLoading,
    addressCustomTokens: customTokens,
    marketCustomTokens,
  } = useContext(CustomTokensContext);
  const {
    isLoading: isTokensDataLoading,
    tokens,
    marketTokens,
    addressSoldTokens,
  } = useContext(TokensContext);

  const addressListedTokens = useMemo(
    () =>
      [...marketTokens, ...marketCustomTokens].filter(
        (token) =>
          token.token_seller == address &&
          token.status.toString() == Status["ACTIVE"].toString()
      ),
    [address, marketCustomTokens, marketTokens]
  );

  if (!window || !(window as any).ethereum) {
    return <h1>Install Metamask - https://metamask.io/download/</h1>;
  } else if (!address) {
    return (
      <div className={styles["connection-container"]}>
        <div className={styles["connection-container-content"]}>
          <p>Please, connect via Metamask to proceed</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return address ? (
    <div>
      {isTokensDataLoading || tokens.length ? (
        <Fragment>
          <div className={styles["portal-page-container"]}>
            <p
              className={styles["portal-page-section"].concat(nunito.className)}
            >
              <b>Personal Tokens</b>
            </p>
          </div>
          <NFTCardList nfts={tokens} />
        </Fragment>
      ) : null}
      {isCustomTokensDataLoading ||
      isTokensDataLoading ||
      addressListedTokens.length ? (
        <Fragment>
          <div className={styles["portal-page-container"]}>
            <p
              className={styles["portal-page-section"].concat(nunito.className)}
            >
              <b>Listed Tokens</b>
            </p>
          </div>
          <NFTCardList nfts={addressListedTokens} />{" "}
        </Fragment>
      ) : null}
      {isTokensDataLoading || addressSoldTokens.length ? (
        <Fragment>
          <div className={styles["portal-page-container"]}>
            <p
              className={styles["portal-page-section"].concat(nunito.className)}
            >
              <b>Recently Sold</b>
            </p>
          </div>
          <NFTCardList nfts={addressSoldTokens} />
        </Fragment>
      ) : null}
      {isCustomTokensDataLoading || customTokens.length ? (
        <Fragment>
          <div className={styles["portal-page-container"]}>
            <p
              className={styles["portal-page-section"].concat(nunito.className)}
            >
              <b>Custom Tokens</b>
            </p>
          </div>
          <NFTCardList nfts={customTokens} />
        </Fragment>
      ) : null}
    </div>
  ) : (
    <div className={styles["message-container"]}>
      <div className={styles["empty-container"]}>
        <p>You have no tokens associated with your address!</p>
      </div>
    </div>
  );
}
