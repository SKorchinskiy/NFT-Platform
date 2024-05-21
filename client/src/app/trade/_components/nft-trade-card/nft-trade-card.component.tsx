import Image from "next/image";
import styles from "./nft-trade-card.module.css";

import { NFT } from "@/app/types/nft.type";

type NftTradeCardProps = {
  nft: NFT;
  nftForTrade: NFT;
  selectedNftHandler: (nft: NFT) => void;
};

export default function NftTradeCard({
  nft,
  nftForTrade,
  selectedNftHandler,
}: NftTradeCardProps) {
  return (
    <div onClick={() => selectedNftHandler(nft)}>
      <Image
        src={nft.image}
        alt="nft"
        className={styles["nft-card-image"]}
        style={{
          border:
            nftForTrade &&
            nftForTrade.token_id === nft.token_id &&
            nftForTrade.nft_contract === nft.nft_contract
              ? "2px solid blue"
              : "",
        }}
        width={200}
        height={200}
      />
    </div>
  );
}
