import styles from "./nft-cancelation-details.module.css";
import { useContext } from "react";
import useResellContract from "@/app/hooks/useResellContract.hook";
import { AddressContext } from "@/app/providers/address.provider";
import useNFTCollectionContract from "@/app/hooks/useNftCollectionContract.hook";
import { contract_addresses } from "@/configs/constants";
import { NFT } from "../../../types/nft.type";
import { Status } from "../nft-card/nft-card.component";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { PopupContext } from "@/app/providers/popup.provider";
import useNftCreateContract from "@/app/hooks/useNftCreateContract.hook";
import useNftMarketContract from "@/app/hooks/useNftMarketContract.hook";

export default function NFTCancelationDetails({
  nft,
  toggleIsCardModalOpen,
}: {
  nft: NFT;
  toggleIsCardModalOpen: Function;
}) {
  const { address } = useContext(AddressContext);
  const { updateText } = useContext(PopupContext);
  const { removeFromMarket } = useContext(TokensContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();
  const nftCreateContract = useNftCreateContract();
  const marketCreateContract = useNftMarketContract();

  const cancelTokenListing = async () => {
    if (
      address &&
      nftCollectionContract &&
      resellContract &&
      nftCreateContract &&
      marketCreateContract
    ) {
      if (nft.nft_contract && nft.seq_id) {
        await nftCreateContract.methods
          .setApprovalForAll(contract_addresses.marketCreateContract, true)
          .send({ from: address });
        await marketCreateContract.methods
          .cancel_nft_listing(contract_addresses.nftCreateContract, nft.seq_id)
          .send({ from: address });
      } else {
        await nftCollectionContract.methods
          .setApprovalForAll(contract_addresses.marketResellContract, true)
          .send({ from: address });
        await resellContract.methods.cancel_token_listing(nft.token_id).send({
          from: address,
        });
      }

      updateText(
        `Successfully canceled NFT-token listing ${nft.token_id.toString()}`
      );
      removeFromMarket(nft.token_id);
      toggleIsCardModalOpen();
    }
  };

  return (
    <div className={styles["nft-details-container"]}>
      <div className={styles["nft-details-info"]}>
        <p>
          <b>Token ID:</b> {nft.token_id.toString()}
        </p>
        <p>
          <b>Collection:</b> {nft.name}
        </p>
        <p>
          <b>Description:</b> {nft.description}
        </p>
        <p>
          <b>Status:</b> {Status[Number(nft.status)]}
        </p>
        <p>
          <b>Seller:</b>{" "}
          {(() => {
            const head = nft.token_seller.slice(0, 5);
            const tail = nft.token_seller.slice(address.length - 5);
            return `${head}...${tail}`;
          })()}
        </p>
        <p>
          <b>Price:</b> {(Number(nft.token_price) / 1e18).toString()} ETH
        </p>
      </div>
      <div className={styles["nft-interactive-container"]}>
        <div className={styles["cancel-button"]} onClick={cancelTokenListing}>
          Cancel listing
        </div>
      </div>
    </div>
  );
}
