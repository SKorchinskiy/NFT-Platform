"use client";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokensContext } from "@/app/providers/trade-tokens.provider";
import Image from "next/image";
import { Fragment, useContext, useMemo } from "react";
import TimeOut from "./_components/time-out/time-out.component";
import BidsList from "./_components/bids-list/bids-list.component";
import { BidsContext } from "@/app/providers/bids.provider";

type AuctionPageProps = {
  params: {
    auction_id: string;
  };
};

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
      <div style={{ display: "flex", height: "600px" }}>
        {target_token ? (
          <Fragment>
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
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
                style={{
                  borderRadius: 5,
                  boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
                }}
              />
              <TimeOut
                end_time={Number(target_token.auction_end_time) * 1000}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 300px)",
                  gridAutoFlow: "row",
                  background: "whitesmoke",
                  padding: 50,
                  boxSizing: "border-box",
                  borderRadius: 5,
                  boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
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
