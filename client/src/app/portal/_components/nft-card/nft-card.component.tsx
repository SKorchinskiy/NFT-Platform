import Image from "next/image";
import styles from "./nft-card.module.css";

import { Fragment, useState } from "react";
import NFTCardModal from "../nft-card-modal/nft-card-modal.component";

export type NFT = {
  nft: {
    attributes: Array<Object>;
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
};

export default function NFTCard({ nft }: NFT) {
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  return (
    <Fragment>
      <div className={styles["card-container"]} onClick={toggleIsCardModalOpen}>
        <Image
          src={nft.image}
          alt="nft"
          width={200}
          height={200}
          style={{
            borderRadius: "10px 10px 0px 0px",
          }}
        />
        <div
          style={{
            background: "red",
            borderRadius: "0px 0px 10px 10px",
          }}
        >
          <div
            style={{
              marginLeft: "15px",
              fontFamily: "fantasy",
              fontSize: "18px",
            }}
          >
            <p>Owned by YOU</p>
            <p>{nft.name}</p>
            <p>{nft.description}</p>
          </div>
        </div>
        <div className={styles["card-overlay"]} />
      </div>
      {isCardModalOpen ? (
        <Fragment>
          <NFTCardModal
            nft={nft}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
          />
          <div
            style={{
              position: "absolute",
              top: -100,
              bottom: -100,
              left: -100,
              right: -100,
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 1,
            }}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
}
