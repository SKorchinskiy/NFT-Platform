import { Fragment, useMemo, useState } from "react";
import NFTCard from "../nft-card/nft-card.component";
import NFTCardModal from "../nft-card-modal/nft-card-modal.component";
import styles from "./nft-card-list.module.css";
import { NFT, NFTs } from "@/app/types/nft.type";

type CardListProps = { nfts: NFTs };

export default function NFTCardList({ nfts }: CardListProps) {
  const [activeToken, setActiveToken] = useState<NFT>(nfts[0]);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  const compressedTokenIds = useMemo(
    () =>
      nfts.reduce(
        (accumulated, currentValue, index) => ({
          ...accumulated,
          [currentValue.token_id.toString() +
          (currentValue.nft_contract ? "x0" : "x1")]: index,
        }),
        {}
      ),
    [nfts]
  ) as {
    [key: string]: number;
  };

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  const initTokenHandler = (nft: NFT) => setActiveToken(nft);

  const activeTokenHandler = (action: -1 | 1) => {
    setActiveToken((prevValue: NFT) => {
      const MOD = nfts.length;
      const targetCompressedId: number =
        (compressedTokenIds[
          prevValue.token_id.toString() + (prevValue.nft_contract ? "x0" : "x1")
        ] +
          action +
          MOD) %
        MOD;
      return (
        nfts.find(
          (token) =>
            token.token_id.toString() + (token.nft_contract ? "x0" : "x1") ==
            Object.entries(compressedTokenIds).reduce((acc, [key, value]) => {
              if (targetCompressedId == value) {
                acc = key;
              }
              return acc;
            }, "")
        ) || nfts[0]
      );
    });
  };

  return (
    <div className={styles["card-list-container"]}>
      <div className={styles["list-cards"]}>
        {nfts.length
          ? nfts.map((nft, index) => (
              <NFTCard
                key={index}
                nft={nft}
                toggleIsCardModalOpen={toggleIsCardModalOpen}
                initTokenHandler={initTokenHandler}
              />
            ))
          : Array.from(Array(8)).map((_, index) => (
              <div key={index} className={styles["card-skeleton"]}>
                <div className={styles["card-skeleton-image"]} />
                <div className={styles["card-skeleton-description"]}>
                  {Array.from(Array(4)).map((_, index) => (
                    <div
                      key={index}
                      className={styles["card-skeleton-detail"]}
                    />
                  ))}
                </div>
              </div>
            ))}
      </div>
      {isCardModalOpen ? (
        <Fragment>
          <NFTCardModal
            nft={activeToken}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            activeTokenHandler={activeTokenHandler}
          />
          <div className={styles["overlay"]} />
        </Fragment>
      ) : null}
    </div>
  );
}
