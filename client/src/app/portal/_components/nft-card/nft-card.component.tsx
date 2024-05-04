import Image from "next/image";
import styles from "./nft-card.module.css";

import { Fragment } from "react";
import { NFT } from "../nft-card-list/nft-card-list.component";

export enum Status {
  NONE,
  CANCELED,
  ACTIVE,
  SOLD,
}

export default function NFTCard({
  nft,
  toggleIsCardModalOpen,
  activeTokenHandler,
}: {
  nft: NFT;
  isCardModalOpen: boolean;
  toggleIsCardModalOpen: Function;
  activeTokenHandler: Function;
}) {
  return (
    <Fragment>
      <div
        className={styles["card-container"]}
        onClick={(e) => {
          activeTokenHandler(nft.tknId);
          toggleIsCardModalOpen();
        }}
      >
        <Image
          src={nft.image}
          alt="nft"
          width={200}
          height={200}
          style={{ borderRadius: "10px 10px 0px 0px" }}
        />
        <div className={styles["card-details-container"]}>
          <div className={styles["card-details"]}>
            <p>Owned by YOU</p>
            <p>{nft.name}</p>
            <p>{nft.description}</p>
            <p>{Number(nft.token_price) / 1e18} ETH</p>
            <p>{Status[Number(nft.status)]}</p>
          </div>
        </div>
        <div className={styles["card-overlay"]} />
      </div>
    </Fragment>
  );
}
