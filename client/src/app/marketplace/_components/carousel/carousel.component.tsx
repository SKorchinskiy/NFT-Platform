import { NFT, NFTs } from "@/app/types/nft.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./carousel.module.css";
import NFTCardModal from "@/app/portal/_components/nft-card-modal/nft-card-modal.component";
import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";

export default function Carousel({ nfts }: { nfts: NFTs }) {
  const [tokens, setTokens] = useState(nfts || []);
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  useEffect(() => setTokens(nfts), [nfts]);

  return (
    <>
      <div className={styles["carousel-container"]}>
        {tokens.length
          ? tokens.slice(0, 6).map((nft, index) => (
              <div
                key={Number(nft.token_id)}
                className={styles["carousel-item"]}
                onClick={() => {
                  toggleIsCardModalOpen();
                  setSelectedNFT(nft);
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <Image
                    src={nft.image}
                    alt="nft"
                    width={300}
                    height={300}
                    className={styles["carousel-item-image"]}
                  />
                  <StatusPlate nft={nft} />
                </div>
              </div>
            ))
          : Array.from(Array(6)).map((_, index) => (
              <div key={index} className={styles["carousel-item"]}>
                <div
                  style={{
                    width: 250,
                    height: 250,
                    background: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 10,
                    boxShadow: "10px 10px 15px rgba(0, 0, 0, 0.5)",
                  }}
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
