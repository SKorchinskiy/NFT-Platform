"use client";

import Image from "next/image";
import styles from "./minting-constructor.module.css";
import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";
import { Fragment, useContext } from "react";
import { AddressContext } from "@/app/providers/address.provider";

type MintingConstructorProps = {
  nftImage: File | string;
  formInput: {
    name: string;
    description: string;
    price: number;
  };
};

export default function MintingConstructor({
  nftImage,
  formInput,
}: MintingConstructorProps) {
  const { address } = useContext(AddressContext);

  return (
    <div className={styles["minting-constructor-container"]}>
      <div className={styles["constructor-image"]}>
        {nftImage ? (
          <div style={{ position: "relative" }}>
            <Image
              src={
                typeof nftImage === "string"
                  ? nftImage
                  : URL.createObjectURL(nftImage)
              }
              alt="img"
              width={309}
              height={309}
              style={{ borderRadius: "10px 10px 0px 0px" }}
            />
            <StatusPlate nft={{ status: BigInt(2) }} />
          </div>
        ) : (
          <div className={styles["image-filler"]}></div>
        )}
      </div>
      <div className={styles["constructor-content"]}>
        <div className={styles["constructor-content-item"]}>
          <span>
            <b>Owned by: </b>
          </span>
          {address ? (
            (() => {
              const head = address.slice(0, 5);
              const tail = address.slice(address.length - 5);
              return `${head}...${tail}`;
            })()
          ) : (
            <div className={styles["input-filler"]}></div>
          )}
        </div>
        <div className={styles["constructor-content-item"]}>
          <span>
            <b>Name: </b>
          </span>
          {formInput.name ? (
            formInput.name
          ) : (
            <div className={styles["input-filler"]}></div>
          )}
        </div>
        <div className={styles["constructor-content-item"]}>
          <span>
            <b>Description: </b>
          </span>
          {formInput.description ? (
            formInput.description
          ) : (
            <div className={styles["input-filler"]}></div>
          )}
        </div>
        <div className={styles["constructor-content-item"]}>
          <span>
            <b>Price: </b>
          </span>
          {formInput.price ? (
            formInput.price + " ETH"
          ) : (
            <div className={styles["input-filler"]}></div>
          )}
        </div>
      </div>
    </div>
  );
}
