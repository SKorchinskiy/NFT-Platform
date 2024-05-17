import styles from "./nft-buying-details.module.css";
import { NFT } from "../../../types/nft.type";
import { useContext } from "react";
import { AddressContext } from "@/app/providers/address.provider";
import useResellContract from "@/app/hooks/useResellContract.hook";
import useNFTCollectionContract from "@/app/hooks/useNftCollectionContract.hook";
import { Status } from "../nft-card/nft-card.component";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { PopupContext } from "@/app/providers/popup.provider";
import useNftMarketContract from "@/app/hooks/useNftMarketContract.hook";
import useNftCreateContract from "@/app/hooks/useNftCreateContract.hook";
import { NetworkContext } from "@/app/providers/network.provider";
import ConnectWallet from "@/app/_components/connect-wallet/connect-wallet.component";

export default function NFTBuyingDetails({
  nft,
  toggleIsCardModalOpen,
}: {
  nft: NFT;
  toggleIsCardModalOpen: Function;
}) {
  const { network } = useContext(NetworkContext);
  const { address } = useContext(AddressContext);
  const { updateText } = useContext(PopupContext);
  const { removeFromMarket } = useContext(TokensContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();
  const nftCreateContract = useNftCreateContract();
  const marketCreateContract = useNftMarketContract();

  const buyListedToken = async () => {
    if (
      address &&
      nftCollectionContract &&
      resellContract &&
      nftCreateContract &&
      marketCreateContract
    ) {
      if (nft.nft_contract && nft.seq_id) {
        await marketCreateContract.methods
          .purchase_nft(network.contracts.nftCreateContract, nft.seq_id)
          .send({ from: address, value: nft.token_price.toString() });
      } else {
        await resellContract.methods.purchase_listed_nft(nft.token_id).send({
          from: address,
          value: nft.token_price.toString(),
        });
      }
      updateText(`Successfully bought NFT-token ${nft.token_id.toString()}`);
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
          <b>Price:</b> {Number(nft.token_price) / 1e18} ETH
        </p>
      </div>
      <div className={styles["nft-interactive-container"]}>
        {address ? (
          <div className={styles["purchase-button"]} onClick={buyListedToken}>
            Buy token
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              width: "250px",
            }}
          >
            <ConnectWallet />
          </div>
        )}
      </div>
    </div>
  );
}
