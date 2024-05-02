import Image from "next/image";
import { NFT } from "../nft-card/nft-card.component";
import styles from "./nft-card-modal.module.css";

import { useState } from "react";

type NFTModalProps = NFT & {
  toggleIsCardModalOpen: Function;
};

export default function NFTCardModal({
  nft,
  toggleIsCardModalOpen,
}: NFTModalProps) {
  const [tokenPrice, setTokenPrice] = useState<number>(1e18);

  return (
    <div
      style={{
        position: "absolute",
        background: "rgb(238, 245, 255, 0.9)",
        left: 200,
        right: 200,
        top: -20,
        bottom: 300,
        zIndex: 2,
        borderRadius: "10px",
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        boxShadow: "15px 20px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          cursor: "pointer",
        }}
        onClick={(e) => toggleIsCardModalOpen()}
      >
        <Image src="/close-sign.png" alt="close" width={35} height={20} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={nft.image}
          alt="nft"
          width={400}
          height={400}
          style={{
            borderRadius: "10px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          marginLeft: 50,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "20px",
          }}
        >
          <p>
            <b>Collection:</b> {nft.name}
          </p>
          <p>
            <b>Description:</b> {nft.description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="number"
              defaultValue={tokenPrice / 1e18}
              value={tokenPrice / 1e18}
              style={{
                marginRight: 50,
                borderRadius: 5,
                border: 0,
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                marginBottom: 10,
                padding: 10,
              }}
              onChange={(e) => {
                const value = Math.max(1e18, parseInt(e.target.value) * 1e18);
                setTokenPrice(value);
              }}
            />
            <Image
              src="/ethereum-sign.png"
              alt="ethereum"
              width={15}
              height={20}
              style={{
                position: "absolute",
                right: 80,
                marginTop: 8,
              }}
            />
          </div>
          <div className={styles["sell-button"]}>Sell token</div>
        </div>
      </div>
    </div>
  );
}
