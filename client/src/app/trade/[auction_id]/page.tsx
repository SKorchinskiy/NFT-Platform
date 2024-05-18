"use client";

import styles from "./page.module.css";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokensContext } from "@/app/providers/trade-tokens.provider";
import Image from "next/image";
import { Fragment, useContext, useMemo } from "react";
import TimeOut from "./_components/time-out/time-out.component";
import BidsList from "./_components/bids-list/bids-list.component";
import { BidsContext } from "@/app/providers/bids.provider";
import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";

type AuctionPageProps = { params: { auction_id: string } };

export default function AuctionPage({
  params: { auction_id },
}: AuctionPageProps) {
  const { tradeNFTs } = useContext(TradeTokensContext);

  const target_token = useMemo(
    () =>
      tradeNFTs.find(
        (token) => Number(token.auction_id) === parseInt(auction_id)
      ),
    [tradeNFTs, auction_id]
  )!;

  const { network } = useContext(NetworkContext);

  const { bids } = useContext(BidsContext);

  return (
    <Fragment>
      <div className={styles["auction-details-container"]}>
        {target_token ? (
          <Fragment>
            <div className={styles["auction-details"]}>
              <div
                style={{
                  position: "relative",
                }}
              >
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
                <StatusPlate nft={{ ...target_token, status: BigInt(4) }} />
              </div>
              <TimeOut
                end_time={Number(target_token.auction_end_time) * 1000}
              />
            </div>
            <div className={styles["auction-description-container"]}>
              <div className={styles["auction-description"]}>
                <p>Auction ID: </p>
                <p>{Number(target_token.auction_id)}</p>
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
      <BidsList bids={bids} />
    </Fragment>
  );
}
