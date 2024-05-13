import { NFT } from "@/app/types/nft.type";
import Image from "next/image";

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
        style={{
          borderRadius: 5,
          boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
          border:
            nftForTrade && nftForTrade.token_id === nft.token_id
              ? "2px solid blue"
              : "",
        }}
        width={200}
        height={200}
      />
    </div>
  );
}
