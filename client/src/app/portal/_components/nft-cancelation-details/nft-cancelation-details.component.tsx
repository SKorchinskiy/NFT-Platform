import styles from "./nft-cancelation-details.module.css";
import { useContext } from "react";
import useResellContract from "@/app/hooks/useResellContract.hook";
import { AddressContext } from "@/app/providers/address.provider";
import useNFTCollectionContract from "@/app/hooks/useNftCollectionContract.hook";
import { NFT } from "../../../types/nft.type";
import { Status } from "../nft-card/nft-card.component";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { PopupContext } from "@/app/providers/popup.provider";
import useNftCreateContract from "@/app/hooks/useNftCreateContract.hook";
import useNftMarketContract from "@/app/hooks/useNftMarketContract.hook";
import { NetworkContext } from "@/app/providers/network.provider";
import ConnectWallet from "@/app/_components/connect-wallet/connect-wallet.component";
import { CustomTokensContext } from "@/app/providers/custom-tokens.provider";

export default function NFTCancelationDetails({
  nft,
  toggleIsCardModalOpen,
}: {
  nft: NFT;
  toggleIsCardModalOpen: Function;
}) {
  const { network } = useContext(NetworkContext);
  const { address } = useContext(AddressContext);
  const { refreshTokens } = useContext(TokensContext);
  const { refreshTokens: refreshCustomTokens } =
    useContext(CustomTokensContext);

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
      try {
        if (nft.nft_contract && nft.seq_id) {
          await nftCreateContract.methods
            .setApprovalForAll(network.contracts.marketCreateContract, true)
            .send({ from: address });
          await marketCreateContract.methods
            .cancel_nft_listing(network.contracts.nftCreateContract, nft.seq_id)
            .send({ from: address });
        } else {
          await nftCollectionContract.methods
            .setApprovalForAll(network.contracts.marketResellContract, true)
            .send({ from: address });
          await resellContract.methods.cancel_token_listing(nft.token_id).send({
            from: address,
          });
        }

        refreshTokens();
        refreshCustomTokens();
        toggleIsCardModalOpen();
      } catch (e) {
        console.log({ e });
      }
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
        {address ? (
          <div className={styles["cancel-button"]} onClick={cancelTokenListing}>
            Cancel listing
          </div>
        ) : (
          <div className={styles["connection-container"]}>
            <ConnectWallet />
          </div>
        )}
      </div>
    </div>
  );
}
