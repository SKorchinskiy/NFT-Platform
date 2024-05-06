"use client";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";

import NFTCardList from "./_components/nft-card-list/nft-card-list.component";

import { Montserrat } from "next/font/google";
import { Status } from "./_components/nft-card/nft-card.component";
import { AddressContext } from "../providers/address.provider";

const nunito = Montserrat({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export default function Portal() {
  const { tokens, marketTokens, purchasedTokens } = useContext(TokensContext);
  const { address } = useContext(AddressContext);

  return tokens ? (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            fontSize: 36,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
          className={nunito.className}
        >
          <b>Personal Tokens</b>
        </p>
      </div>
      <NFTCardList nfts={tokens.slice(0, 8)} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            fontSize: 36,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
          className={nunito.className}
        >
          <b>Listed Tokens</b>
        </p>
      </div>
      <NFTCardList
        nfts={marketTokens
          .filter(
            (token) =>
              token.token_seller == address &&
              token.status.toString() == Status["ACTIVE"].toString()
          )
          .slice(0, 8)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            fontSize: 36,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
          className={nunito.className}
        >
          <b>Recently Sold</b>
        </p>
      </div>
      <NFTCardList
        nfts={purchasedTokens
          .filter(
            (token) =>
              token.token_seller == address &&
              token.status.toString() == Status["SOLD"].toString()
          )
          .slice(0, 8)}
      />
    </div>
  ) : null;
}
