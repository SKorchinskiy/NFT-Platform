import { NFT, NFTs } from "@/app/types/nft.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./carousel.module.css";
import NFTCardModal from "@/app/portal/_components/nft-card-modal/nft-card-modal.component";

export default function Carousel({ nfts }: { nfts: NFTs }) {
  const [tokens, setTokens] = useState(nfts || []);
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  useEffect(() => {
    const newTokens = tokens.slice(3).concat(tokens[0], tokens[1], tokens[2]);

    setTimeout(() => {
      setTokens(newTokens);
    }, 6000);
  }, [tokens]);

  return (
    <>
      <div className={styles["carousel-container"]}>
        {tokens.slice(0, 6).map((nft, index) => (
          <div
            key={index}
            className={styles["carousel-item"]}
            onClick={() => {
              toggleIsCardModalOpen();
              setSelectedNFT(nft);
            }}
          >
            <Image
              src={nft.image}
              alt="nft"
              width={300}
              height={300}
              className={styles["carousel-item-image"]}
            />
          </div>
        ))}
      </div>
      {isCardModalOpen && selectedNFT ? (
        <>
          <NFTCardModal
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            nft={selectedNFT}
            isScrollable={false}
            activeTokenHandler={() => {}}
          />
          <div className={styles["carousel-overlay"]} />
        </>
      ) : null}
    </>
  );
}
