import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";
import styles from "./trade-card.module.css";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokens } from "@/app/types/trade-tokens.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  return (
    <div
      className={styles["trade-card-container"]}
      style={{
        position: "relative",
      }}
    >
      <div className={styles["trade-card-representation"]}>
        <Image
          src={token.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
          alt="nft"
          width={200}
          height={200}
        />
        <StatusPlate nft={{ ...token, status: BigInt(4) }} />
        <button
          className={styles["participation-button"]}
          onClick={() =>
            router.push("trade/" + Number(token.auction_id).toString())
          }
        >
          Participate
        </button>
      </div>
      <div className={styles["trade-card-details"]}>
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
          {new Date(Number(token.auction_end_time))
            .toISOString()
            .replace("T", " ")}
        </p>
      </div>
    </div>
  );
}
