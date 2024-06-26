import Image from "next/image";
import styles from "./nft-listing-details.module.css";
import { NFT } from "../../../types/nft.type";
import { useContext, useState } from "react";
import { AddressContext } from "@/app/providers/address.provider";
import useNFTCollectionContract from "@/app/hooks/useNftCollectionContract.hook";
import useResellContract from "@/app/hooks/useResellContract.hook";
import { Status } from "../nft-card/nft-card.component";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { PopupContext } from "@/app/providers/popup.provider";
import useNftCreateContract from "@/app/hooks/useNftCreateContract.hook";
import useNftMarketContract from "@/app/hooks/useNftMarketContract.hook";
import { NetworkContext } from "@/app/providers/network.provider";
import { CustomTokensContext } from "@/app/providers/custom-tokens.provider";

export default function NFTListingDetails({
  nft,
  toggleIsCardModalOpen,
}: {
  nft: NFT;
  toggleIsCardModalOpen: Function;
}) {
  const [tokenPrice, setTokenPrice] = useState<number>(1e18);

  const { network } = useContext(NetworkContext);
  const { address } = useContext(AddressContext);
  const { refreshTokens } = useContext(TokensContext);
  const { refreshTokens: refreshCustomTokens } =
    useContext(CustomTokensContext);

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();
  const nftCreateContract = useNftCreateContract();
  const marketCreateContract = useNftMarketContract();

  const listTokenForSale = async () => {
    if (
      address &&
      nftCollectionContract &&
      resellContract &&
      nftCreateContract &&
      marketCreateContract
    ) {
      try {
        if (nft.nft_contract) {
          await nftCreateContract.methods
            .setApprovalForAll(network.contracts.marketCreateContract, true)
            .send({ from: address });

          const listing_fee = "25000000000000";

          await marketCreateContract.methods
            .create_nft_asset(
              network.contracts.nftCreateContract,
              nft.token_id,
              tokenPrice
            )
            .send({ from: address, value: listing_fee });
        } else {
          await nftCollectionContract.methods
            .setApprovalForAll(network.contracts.marketResellContract, true)
            .send({
              from: address,
            });

          const listing_fee = (
            (await resellContract.methods.get_listing_fee().call({
              from: address,
            })) as number
          ).toString();

          await resellContract.methods
            .list_token(nft.token_id, tokenPrice)
            .send({
              from: address,
              value: listing_fee,
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
          <b>Owner:</b>{" "}
          {(() => {
            const head = nft.token_seller.slice(0, 5);
            const tail = nft.token_seller.slice(address.length - 5);
            return `${head}...${tail}`;
          })()}
        </p>
      </div>
      <div className={styles["nft-interactive-container"]}>
        <div className={styles["token-input-container"]}>
          <input
            type="number"
            defaultValue={tokenPrice / 1e18}
            value={tokenPrice / 1e18}
            className={styles["token-input"]}
            onChange={(e) => {
              const value = Math.max(1e18, parseInt(e.target.value) * 1e18);
              setTokenPrice(value);
            }}
          />
          <Image
            src="/ethereum-sign.png"
            alt="ethereum"
            width={15}
            height={20}
            className={styles["atr-ethereum-pic"]}
          />
        </div>
        <div className={styles["list-button"]} onClick={listTokenForSale}>
          List token
        </div>
      </div>
    </div>
  );
}
