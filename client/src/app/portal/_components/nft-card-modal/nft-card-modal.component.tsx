import Image from "next/image";
import styles from "./nft-card-modal.module.css";
import { NFT } from "../../../types/nft.type";
import NFTListingDetails from "../nft-listing-details/nft-listing-details.component";
import { Status } from "../nft-card/nft-card.component";
import { useContext } from "react";
import { AddressContext } from "@/app/providers/address.provider";
import NFTCancelationDetails from "../nft-cancelation-details/nft-cancelation-details.component";
import NFTBuyingDetails from "../nft-buying-details/nft-buying-details.component";
import NFTPurchaseDetails from "../nft-purchase-details/nft-purchase-details.component";
import { NetworkContext } from "@/app/providers/network.provider";

type NFTModalProps = {
  nft: NFT;
  isScrollable?: boolean;
  toggleIsCardModalOpen: Function;
  activeTokenHandler: Function;
};

export default function NFTCardModal({
  nft,
  isScrollable = true,
  toggleIsCardModalOpen,
  activeTokenHandler,
}: NFTModalProps) {
  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal-container"]}>
        <div
          className={styles["atr-close"]}
          onClick={(e) => toggleIsCardModalOpen()}
        >
          <Image src="/close-sign.png" alt="close" width={35} height={20} />
        </div>
        <div
          style={{ display: isScrollable ? "block" : "none" }}
          className={styles["atr-arrow-left"]}
          onClick={(e) => activeTokenHandler(-1)}
        >
          <Image src="/arrow-left.png" alt="close" width={40} height={40} />
        </div>
        <div
          style={{ display: isScrollable ? "block" : "none" }}
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
            Number(nft.status) == Status.ACTIVE ||
            nft.token_holder === network.contracts.marketCreateContract
          ) {
            return nft.token_seller == address ? (
              <NFTCancelationDetails
                nft={nft}
                toggleIsCardModalOpen={toggleIsCardModalOpen}
              />
            ) : (
              <NFTBuyingDetails
                nft={nft}
                toggleIsCardModalOpen={toggleIsCardModalOpen}
              />
            );
          } else if (Number(nft.status) == Status.NONE) {
            return (
              <NFTListingDetails
                nft={nft}
                toggleIsCardModalOpen={toggleIsCardModalOpen}
              />
            );
          } else if (Number(nft.status) == Status.SOLD) {
            return <NFTPurchaseDetails nft={nft} />;
          }
          return <></>;
        })()}
      </div>
    </div>
  );
}
// 250
