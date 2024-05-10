"use client";

import { useContext } from "react";
import { TokensContext } from "../providers/nft-tokens.provider";
import NFTCardList from "../portal/_components/nft-card-list/nft-card-list.component";

import { Montserrat } from "next/font/google";
import { Status } from "../portal/_components/nft-card/nft-card.component";
import Carousel from "./_components/carousel/carousel.component";
import { CustomTokensContext } from "../providers/custom-tokens.provider";

const nunito = Montserrat({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
});

export default function MarketplacePage() {
  const { marketCustomTokens: customTokens } = useContext(CustomTokensContext);
  const { marketTokens, purchasedTokens } = useContext(TokensContext);

  return (
    <div>
      <Carousel nfts={marketTokens} />
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
          <b>Minted for Sale</b>
        </p>
      </div>
      <NFTCardList
        nfts={customTokens.filter((token) => {
          return Number(token.token_price) / 1e18 >= 1;
        })}
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
          <b>Recently Purchased</b>
        </p>
      </div>
      <NFTCardList
        nfts={purchasedTokens
          .filter(
            (token) => token.status.toString() == Status["SOLD"].toString()
          )
          .slice(0, 8)}
      />
    </div>
  );
}
