import Image from "next/image";
import styles from "./nft-card.module.css";

import { useContext } from "react";
import { NFT } from "@/app/types/nft.type";
import { AddressContext } from "@/app/providers/address.provider";
import StatusPlate from "../status-plate/status-plate.component";
import { NetworkContext } from "@/app/providers/network.provider";

export enum Status {
  NONE,
  CANCELED,
  ACTIVE,
  SOLD,
  TRADE,
  ENDED,
}

type CardProps = {
  nft: NFT;
  tokenIndex: number;
  toggleIsCardModalOpen: Function;
  initTokenHandler: Function;
};

export default function NFTCard({
  nft,
  tokenIndex,
  toggleIsCardModalOpen,
  initTokenHandler,
}: CardProps) {
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  return (
    <div
      className={styles["card-container"]}
      onClick={(e) => {
        initTokenHandler(tokenIndex);
        toggleIsCardModalOpen();
      }}
    >
      <Image
        src={nft.image}
        alt="nft"
        width={250}
        height={250}
        style={{ borderRadius: "10px 10px 0px 0px" }}
      />
      <StatusPlate nft={nft} />
      <div className={styles["card-details-container"]}>
        <div className={styles["card-details"]}>
          <p>
            <b>Owned by: </b>
            {nft.token_seller == address
              ? "YOU"
              : (() => {
                  const head = nft.token_seller.slice(0, 5);
                  const tail = nft.token_seller.slice(address.length - 5);
                  return `${head}...${tail}`;
                })()}
          </p>
          <p>
            <b>Collection: </b> {nft.name}
          </p>
          <p>
            <b>Description: </b> {nft.description}
          </p>
          <p>
            <b>Price: </b>
            {(Number(nft.token_price) / 1e18).toString() + " " + network.symbol}
          </p>
        </div>
      </div>
      <div className={styles["card-overlay"]} />
    </div>
  );
}
