import { NFT } from "@/app/types/nft.type";
import styles from "./nft-purchase-details.module.css";
import { Status } from "../nft-card/nft-card.component";
import { useContext } from "react";
import { NetworkContext } from "@/app/providers/network.provider";

export default function NFTPurchaseDetails({ nft }: { nft: NFT }) {
  const { network } = useContext(NetworkContext);

  return (
    <div className={styles["nft-details-container"]}>
      <div className={styles["nft-details-info"]}>
        <p>
          <b>Token ID:</b> {nft.token_id.toString()}
        </p>
        <p>
          <b>Collection:</b> {nft.name}
        </p>
        <p>
          <b>Description:</b> {nft.description}
        </p>
        <p>
          <b>Status:</b> {Status[Number(nft.status)]}
        </p>
        <p>
          <b>Seller:</b>{" "}
          {(() => {
            const head = nft.token_seller.slice(0, 5);
            const tail = nft.token_seller.slice(nft.token_seller.length - 5);
            return `${head}...${tail}`;
          })()}
        </p>
        <p>
          <b>Buyer:</b>{" "}
          {(() => {
            const head = nft.token_holder.slice(0, 5);
            const tail = nft.token_holder.slice(nft.token_holder.length - 5);
            return `${head}...${tail}`;
          })()}
        </p>
        <p>
          <b>Price:</b> {(Number(nft.token_price) / 1e18).toString() + " " + network.symbol}
        </p>
      </div>
    </div>
  );
}
