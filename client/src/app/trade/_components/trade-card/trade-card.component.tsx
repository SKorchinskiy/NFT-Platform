import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokens } from "@/app/types/trade-tokens.type";
import Image from "next/image";
import { useContext } from "react";

type TradeCardProps = {
  token: TradeTokens & {
    name: string;
    image: string;
    external_url: string;
    description: string;
    attributes: Array<Object>;
  };
};

export default function TradeCard({ token }: TradeCardProps) {
  const { network } = useContext(NetworkContext);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        background: "whitesmoke",
        padding: 50,
        margin: 50,
        overflow: "scroll",
        border: "1px solid black",
        borderRadius: 5,
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <Image
          src={token.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt="nft"
          width={200}
          height={200}
        />
        <button
          style={{
            padding: 15,
            borderRadius: 5,
            border: 0,
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Participate
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 300px)",
          gridAutoFlow: "row",
        }}
      >
        <p>Auction ID: </p>
        <p>{Number(token.auction_id)}</p>
        <p>Beneficiary: </p>
        <p>
          {(() => {
            const shorthened_address =
              token.beneficiary.slice(0, 5) +
              "..." +
              token.beneficiary.slice(-5);
            return shorthened_address;
          })()}
        </p>
        <p>Highest Bid:</p>
        <p>
          {Number(token.highest_bid) / 1e18} {network.symbol}
        </p>
        <p>Highest Bidder: </p>
        <p>
          {(() => {
            const shorthened_address =
              token.highest_bidder.slice(0, 5) +
              "..." +
              token.highest_bidder.slice(-5);
            return shorthened_address;
          })()}
        </p>
        <p>Token Id: </p>
        <p>{Number(token.token_id)}</p>
        <p>NFT-Collection: </p>
        <p>
          {(() => {
            const shorthened_address =
              token.nft_contract.slice(0, 5) +
              "..." +
              token.nft_contract.slice(-5);
            return shorthened_address;
          })()}
        </p>
        <p>Auction End Time: </p>
        <p>
          {new Date(Number(token.auction_end_time) * 1000)
            .toISOString()
            .replace("T", " ")}
        </p>
      </div>
    </div>
  );
}
