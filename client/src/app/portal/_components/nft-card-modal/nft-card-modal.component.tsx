import Image from "next/image";
import styles from "./nft-card-modal.module.css";
import { NFT } from "../../../types/nft.type";
import NFTListingDetails from "../nft-listing-details/nft-listing-details.component";
import { Status } from "../nft-card/nft-card.component";
import { useContext } from "react";
import { AddressContext } from "@/app/providers/address.provider";
import NFTCancelationDetails from "../nft-cancelation-details/nft-cancelation-details.component";
import NFTBuyingDetails from "../nft-buying-details/nft-buying-details.component";

type NFTModalProps = {
  nft: NFT;
  toggleIsCardModalOpen: Function;
  activeTokenHandler: Function;
};

export default function NFTCardModal({
  nft,
  toggleIsCardModalOpen,
  activeTokenHandler,
}: NFTModalProps) {
  const { address } = useContext(AddressContext);

  return (
    <div className={styles["modal-container"]}>
      <div
        className={styles["atr-close"]}
        onClick={(e) => toggleIsCardModalOpen()}
      >
        <Image src="/close-sign.png" alt="close" width={35} height={20} />
      </div>
      <div
        className={styles["atr-arrow-left"]}
        onClick={(e) => activeTokenHandler(-1)}
      >
        <Image src="/arrow-left.png" alt="close" width={40} height={40} />
      </div>
      <div
        className={styles["atr-arrow-right"]}
        onClick={(e) => activeTokenHandler(1)}
      >
        <Image src="/arrow-right.png" alt="close" width={40} height={40} />
      </div>
      <div className={styles["atr-nft-image"]}>
        <Image
          src={nft.image}
          alt="nft"
          width={400}
          height={400}
          style={{ borderRadius: "10px" }}
        />
      </div>
      {(() => {
        if (
          Number(nft.status) == Status.ACTIVE &&
          nft.token_seller == address
        ) {
          return (
            <NFTCancelationDetails
              nft={nft}
              toggleIsCardModalOpen={toggleIsCardModalOpen}
            />
          );
        } else if (Number(nft.status) == Status.ACTIVE) {
          return (
            <NFTBuyingDetails
              nft={nft}
              toggleIsCardModalOpen={toggleIsCardModalOpen}
            />
          );
        } else if (nft.token_seller == address) {
          return (
            <NFTListingDetails
              nft={nft}
              toggleIsCardModalOpen={toggleIsCardModalOpen}
            />
          );
        }
        return <></>;
      })()}
    </div>
  );
}
// 250
