import { Fragment, useMemo, useState } from "react";
import NFTCard from "../nft-card/nft-card.component";
import NFTCardModal from "../nft-card-modal/nft-card-modal.component";
import styles from "./nft-card-list.module.css";
import { NFT, NFTs } from "@/app/types/nft.type";

type CardListProps = { nfts: NFTs };

export default function NFTCardList({ nfts }: CardListProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeToken, setActiveToken] = useState<NFT>(nfts[0]);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  const initTokenHandler = (activeIdx: number) => {
    setActiveToken(nfts[activeIdx]);
    setActiveIdx(activeIdx);
  };

  const activeTokenHandler = (action: -1 | 1) => {
    const MOD = nfts.length;
    setActiveToken(nfts[(activeIdx + action + MOD) % MOD]);
    setActiveIdx((activeIdx + action + MOD) % MOD);
  };

  return (
    <div className={styles["card-list-container"]}>
      <div className={styles["list-cards"]}>
        {nfts.length
          ? nfts.map((nft, index) => (
              <NFTCard
                key={index}
                nft={nft}
                tokenIndex={index}
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
