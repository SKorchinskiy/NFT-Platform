import { Fragment, useEffect, useState } from "react";
import NFTCard from "../nft-card/nft-card.component";
import NFTCardModal from "../nft-card-modal/nft-card-modal.component";
import styles from "./nft-card-list.module.css";

export type NFT = {
  attributes: Array<Object>;
  description: string;
  external_url: string;
  image: string;
  name: string;
  status: BigInt;
  token_holder: string;
  token_id: BigInt;
  token_price: BigInt;
  token_seller: string;
  tknId: BigInt;
};

export type NFTs = Array<NFT>;

export default function NFTCardList({ nfts }: { nfts: Array<NFT> }) {
  const [activeToken, setActiveToken] = useState<number>(0);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  const activeTokenHandler = (tokenInd: number) => setActiveToken(tokenInd);

  useEffect(() => {
    console.log({ activeToken });
  }, [activeToken]);

  return (
    <div className={styles["card-list-container"]}>
      <div className={styles["list-cards"]}>
        {nfts.map((nft, index) => (
          <NFTCard
            key={index}
            nft={nft}
            isCardModalOpen={isCardModalOpen}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            activeTokenHandler={activeTokenHandler}
          />
        ))}
      </div>
      {isCardModalOpen ? (
        <Fragment>
          <NFTCardModal
            tokenIndex={activeToken}
            nfts={nfts}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            activeTokenHandler={activeTokenHandler}
          />
          <div className={styles["overlay"]} />
        </Fragment>
      ) : null}
    </div>
  );
}
