"use client";

import styles from "./page.module.css";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokensContext } from "@/app/providers/trade-tokens.provider";
import Image from "next/image";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import TimeOut from "./_components/time-out/time-out.component";
import BidsList from "./_components/bids-list/bids-list.component";
import { BidsContext } from "@/app/providers/bids.provider";
import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";
import useEnglishAuctionContract from "@/app/hooks/useEnglishAuctionContract.hook";
import useBlindAuctionContract from "@/app/hooks/useBlindAuctionContract.hook";
import { AddressContext } from "@/app/providers/address.provider";
import {
  AuctionsContext,
  BlindAuction,
  EnglishAuction,
} from "@/app/providers/auctions.provider";
import { Bid } from "@/app/types/bid.type";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { CustomTokensContext } from "@/app/providers/custom-tokens.provider";

type AuctionPageProps = { params: { auction_id: string } };

export default function AuctionPage({
  params: { auction_id },
}: AuctionPageProps) {
  const { tradeNFTs } = useContext(TradeTokensContext);

  const englishAuctionContract = useEnglishAuctionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const { address } = useContext(AddressContext);

  const { network } = useContext(NetworkContext);

  const { getSpecificAuctionBids } = useContext(BidsContext);

  const [bids, setBids] = useState<Bid[]>([]);

  const { englishAuctions, blindAuctions } = useContext(AuctionsContext);

  const { auctionsMapper } = useContext(TradeTokensContext);

  const target_auction = useMemo(() => {
    const tp = Object.values(auctionsMapper.english).reduce(
      (acc: string, value: number) => {
        if (value === +auction_id) {
          acc = "english";
        }
        return acc;
      },
      "blind"
    );
    if (tp === "english") {
      return englishAuctions.find(
        (auction) =>
          Number(auction.auction_id) ===
          +(Object.entries(auctionsMapper.english).find(
            ([key, value]) => +value === +auction_id
          ) || [0, 1])[0]
      );
    }
    return blindAuctions.find(
      (auction) =>
        Number(auction.auction_id) ===
        +(Object.entries(auctionsMapper.blind).find(
          ([key, value]) => +value === +auction_id
        ) || [0, 1])[0]
    ) as BlindAuction | EnglishAuction;
  }, [englishAuctions, blindAuctions, auction_id, auctionsMapper]);
  const target_token = useMemo(() => {
    if (tradeNFTs && target_auction) {
      return tradeNFTs.find(
        (token) =>
          Number(token.auction_id) === Number(target_auction.auction_id) &&
          token.is_blind === target_auction.is_blind
      );
    }
  }, [tradeNFTs, target_auction]);
  const hasEnded: Boolean = useMemo(
    () =>
      (target_token &&
        Date.now() / 1e3 - Number(target_token.auction_end_time) > 0) ||
      false,
    [target_token]
  );

  useEffect(() => {
    const retrieveAuctionBids = async () => {
      if (target_auction) {
        const auctionBids = await getSpecificAuctionBids(target_auction);
        setBids(auctionBids);
      }
    };
    retrieveAuctionBids();
  }, [target_auction, getSpecificAuctionBids]);

  const { refreshTokens } = useContext(TokensContext);
  const { refreshTokens: refreshCustomTokens } =
    useContext(CustomTokensContext);

  const endAuctionHandler = async () => {
    if (englishAuctionContract && blindAuctionContract) {
      try {
        if (target_auction)
          if (target_auction.is_blind) {
            await blindAuctionContract.methods
              .reveal(target_auction.auction_id)
              .send({ from: address });
            await blindAuctionContract.methods
              .auctionEnd(target_auction.auction_id)
              .send({ from: address });
          } else {
            await englishAuctionContract.methods
              .auctionEnd(target_auction.auction_id)
              .send({ from: address });
          }
        refreshTokens();
        refreshCustomTokens();
      } catch (e) {
        console.log({ e });
      }
    }
  };

  const withdrawFromAuction = async () => {
    if (englishAuctionContract && blindAuctionContract) {
      try {
        if (target_auction)
          if (target_auction.is_blind) {
            try {
              await blindAuctionContract.methods
                .withdraw()
                .send({ from: address });
            } catch (e) {
              console.log({ e });
            }
          } else {
            try {
              await englishAuctionContract.methods
                .withdraw()
                .send({ from: address });
            } catch (e) {
              console.log({ e });
            }
          }
        refreshTokens();
        refreshCustomTokens();
      } catch (e) {
        console.log({ e });
      }
    }
  };

  return (
    <Fragment>
      <div className={styles["auction-details-container"]}>
        {target_token ? (
          <Fragment>
            <div className={styles["auction-details"]}>
              <div style={{ position: "relative" }}>
                <Image
                  src={target_token.image.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  )}
                  alt="token"
                  width={400}
                  height={400}
                  className={styles["token-image"]}
                />
                <StatusPlate
                  nft={{
                    ...target_token,
                    status: hasEnded ? BigInt(5) : BigInt(4),
                  }}
                />
              </div>
              <TimeOut
                end_time={Number(target_token.auction_end_time) * 1000}
              />
              <button
                onClick={() => endAuctionHandler()}
                className={styles["end-auction-button"]}
                style={{ visibility: hasEnded ? "visible" : "collapse" }}
              >
                End Auction
              </button>
              <button
                onClick={() => withdrawFromAuction()}
                className={styles["end-auction-button"]}
                style={{ visibility: hasEnded ? "visible" : "collapse" }}
              >
                Withdraw
              </button>
            </div>
            <div className={styles["auction-description-container"]}>
              <div className={styles["auction-description"]}>
                <p>Auction ID: </p>
                <p>{Number(target_token.auction_id)}</p>
                <p>Mapped ID: </p>
                <p>{Number(target_token.mappedAuctionId)}</p>
                <p>Beneficiary: </p>
                <p>
                  {(() => {
                    const shorthened_address =
                      target_token.beneficiary.slice(0, 5) +
                      "..." +
                      target_token.beneficiary.slice(-5);
                    return shorthened_address;
                  })()}
                </p>
                <p>Highest Bid:</p>
                <p>
                  {Number(target_token.highest_bid) / 1e18} {network.symbol}
                </p>
                <p>Highest Bidder: </p>
                <p>
                  {(() => {
                    const shorthened_address =
                      target_token.highest_bidder.slice(0, 5) +
                      "..." +
                      target_token.highest_bidder.slice(-5);
                    return shorthened_address;
                  })()}
                </p>
                <p>Token Id: </p>
                <p>{Number(target_token.token_id)}</p>
                <p>Description: </p>
                <p>{target_token.description}</p>
                <p>NFT-Collection: </p>
                <p>
                  {(() => {
                    const shorthened_address =
                      target_token.nft_contract.slice(0, 5) +
                      "..." +
                      target_token.nft_contract.slice(-5);
                    return shorthened_address;
                  })()}
                </p>
                <p>Auction End Time: </p>
                <p>
                  {new Date(Number(target_token.auction_end_time) * 1000)
                    .toISOString()
                    .replace("T", " ")}
                </p>
              </div>
            </div>
          </Fragment>
        ) : null}
      </div>
      {target_auction ? (
        <BidsList bids={bids} target_auction={target_auction} />
      ) : null}
    </Fragment>
  );
}
