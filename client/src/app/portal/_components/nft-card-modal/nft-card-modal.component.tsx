import Image from "next/image";
import styles from "./nft-card-modal.module.css";

import { useContext, useMemo, useState } from "react";

import { TokensContext } from "@/app/providers/nft-tokens.provider";
import { AddressContext } from "@/app/providers/address.provider";

import useResellContract from "@/app/hooks/useResellContract.hook";
import useNFTCollectionContract from "@/app/hooks/useNftCollectionContract.hook";
import { contract_addresses } from "@/configs/constants";

import { Status } from "../nft-card/nft-card.component";
import { NFT } from "../nft-card-list/nft-card-list.component";

type NFTModalProps = {
  tokenIndex: number;
  nfts: NFT[];
  toggleIsCardModalOpen: Function;
  activeTokenHandler: Function;
};

export default function NFTCardModal({
  tokenIndex,
  nfts,
  toggleIsCardModalOpen,
  activeTokenHandler,
}: NFTModalProps) {
  const [tokenPrice, setTokenPrice] = useState<number>(1e18);

  const { address } = useContext(AddressContext);
  const nft = useMemo(
    () =>
      nfts.find((token) => {
        console.log({ here: token }, Number(token.tknId), tokenIndex);
        return Number(token.tknId) == tokenIndex;
      }) || ({} as NFT),
    [nfts, tokenIndex]
  );
  console.log({ nft });

  const resellContract = useResellContract();
  const nftCollectionContract = useNFTCollectionContract();

  const listTokenForSale = async () => {
    if (address && nftCollectionContract && resellContract) {
      await nftCollectionContract.methods
        .setApprovalForAll(contract_addresses.marketResellContract, true)
        .call({
          from: address,
        });

      const listing_fee = (
        (await resellContract.methods.get_listing_fee().call({
          from: address,
        })) as number
      ).toString();

      console.log({ listing_fee });
      await resellContract.methods.list_token(nft.tknId, tokenPrice).send({
        from: address,
        value: listing_fee,
      });
    }
  };

  const cancelTokenListing = async () => {
    if (address && nftCollectionContract && resellContract) {
      await nftCollectionContract.methods
        .setApprovalForAll(contract_addresses.marketResellContract, true)
        .call({
          from: address,
        });
      await resellContract.methods.cancel_token_listing(nft.tknId).send({
        from: address,
      });
    }
  };

  const buyListedToken = async () => {
    if (address && nftCollectionContract && resellContract) {
      await nftCollectionContract.methods
        .setApprovalForAll(contract_addresses.marketResellContract, true)
        .call({
          from: address,
          gas: "3000000",
        });
      const tokenPrice = (await resellContract.methods
        .get_nft_price(nft.tknId)
        .call({
          from: address,
        })) as number;
      await resellContract.methods.purchase_listed_nft(nft.tknId).send({
        from: address,
        value: tokenPrice.toString(),
      });
    }
  };

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
        onClick={(e) =>
          activeTokenHandler(
            (Number(tokenIndex) - 1 + nfts.length) % nfts.length
          )
        }
      >
        <Image src="/arrow-left.png" alt="close" width={40} height={40} />
      </div>
      <div
        className={styles["atr-arrow-right"]}
        onClick={(e) =>
          activeTokenHandler((Number(tokenIndex) + 1) % nfts.length)
        }
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
      <div className={styles["nft-details-container"]}>
        <div className={styles["nft-details-info"]}>
          <p>
            <b>Collection:</b> {nft.name}
          </p>
          <p>
            <b>Description:</b> {nft.description}
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
          {Number(nft.status) == Status.ACTIVE &&
          nft.token_seller == address ? (
            <div className={styles["sell-button"]} onClick={cancelTokenListing}>
              Cancel listing
            </div>
          ) : (
            <div className={styles["sell-button"]} onClick={listTokenForSale}>
              List token
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// 250
