"use client";

import styles from "./page.module.css";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";

import NFTCardList from "./_components/nft-card-list/nft-card-list.component";

import { Montserrat } from "next/font/google";
import { Status } from "./_components/nft-card/nft-card.component";
import { AddressContext } from "../providers/address.provider";
import { CustomTokensContext } from "../providers/custom-tokens.provider";

const nunito = Montserrat({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export default function Portal() {
  const { address } = useContext(AddressContext);
  const { addressCustomTokens: customTokens, marketCustomTokens } =
    useContext(CustomTokensContext);
  const { tokens, marketTokens, purchasedTokens } = useContext(TokensContext);

  console.log({ customTokens });

  return tokens ? (
    <div>
      <div className={styles["portal-page-container"]}>
        <p className={styles["portal-page-section"].concat(nunito.className)}>
          <b>Personal Tokens</b>
        </p>
      </div>
      <NFTCardList nfts={tokens} />
      <div className={styles["portal-page-container"]}>
        <p className={styles["portal-page-section"].concat(nunito.className)}>
          <b>Listed Tokens</b>
        </p>
      </div>
      <NFTCardList
        nfts={[...marketTokens, ...marketCustomTokens].filter(
          (token) =>
            token.token_seller == address &&
            token.status.toString() == Status["ACTIVE"].toString()
        )}
      />
      <div className={styles["portal-page-container"]}>
        <p className={styles["portal-page-section"].concat(nunito.className)}>
          <b>Recently Sold</b>
        </p>
      </div>
      <NFTCardList
        nfts={purchasedTokens.filter(
          (token) =>
            token.token_seller == address &&
            token.status.toString() == Status["SOLD"].toString()
        )}
      />
      <div className={styles["portal-page-container"]}>
        <p className={styles["portal-page-section"].concat(nunito.className)}>
          <b>Custom Tokens</b>
        </p>
      </div>
      <NFTCardList nfts={customTokens} />
    </div>
  ) : null;
}
