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
      <div
        style={{
          display: "flex",
          position: "relative",
          transitionDuration: "500ms",
          background: "rgba(0, 0, 0, 0.1)",
          width: "100%",
          height: "350px",
        }}
      >
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
              style={{
                borderRadius: "10px",
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
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 1,
            }}
          />
        </>
      ) : null}
    </>
  );
}
