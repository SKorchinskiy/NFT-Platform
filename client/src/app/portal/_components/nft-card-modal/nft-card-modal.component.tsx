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
  toggleIsCardModalOpen: Function;
  activeTokenHandler: Function;
};

export default function NFTCardModal({
  tokenIndex,
  toggleIsCardModalOpen,
  activeTokenHandler,
}: NFTModalProps) {
  const [tokenPrice, setTokenPrice] = useState<number>(1e18);

  const { tokens, allTokens } = useContext(TokensContext);
  const { address } = useContext(AddressContext);
  console.log({ tokens, allTokens, tokenIndex });
  const nft = useMemo(
    () =>
      [...tokens, ...allTokens].find((token) => {
        console.log({ here: token }, Number(token.token_id), tokenIndex);
        return Number(token.token_id) == tokenIndex;
      }) || ({} as NFT),
    [tokenIndex, tokens, allTokens]
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
      await resellContract.methods.list_token(nft.token_id, tokenPrice).send({
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
      await resellContract.methods.cancel_token_listing(nft.token_id).send({
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
        });
      const tokenPrice = (await resellContract.methods
        .get_nft_price(nft.token_id)
        .call({
          from: address,
        })) as number;
      await resellContract.methods.purchase_listed_nft(nft.token_id).send({
        from: address,
        value: tokenPrice.toString(),
      });
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        background: "rgb(238, 245, 255, 0.9)",
        left: 200,
        right: 200,
        top: 70,
        height: 450,
        zIndex: 2,
        borderRadius: "10px",
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        boxShadow: "15px 20px 15px rgba(0, 0, 0, 0.3)",
        padding: 50,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          cursor: "pointer",
        }}
        onClick={(e) => toggleIsCardModalOpen()}
      >
        <Image src="/close-sign.png" alt="close" width={35} height={20} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 5,
          cursor: "pointer",
        }}
        onClick={(e) =>
          activeTokenHandler((tokenIndex - 1 + tokens.length) % tokens.length)
        }
      >
        <Image src="/arrow-left.png" alt="close" width={40} height={40} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 250,
          right: 5,
          cursor: "pointer",
        }}
        onClick={(e) => activeTokenHandler((tokenIndex + 1) % tokens.length)}
      >
        <Image src="/arrow-right.png" alt="close" width={40} height={40} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={nft.image}
          alt="nft"
          width={400}
          height={400}
          style={{
            borderRadius: "10px",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          marginLeft: 50,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "20px",
          }}
        >
          <p>
            <b>Collection:</b> {nft.name}
          </p>
          <p>
            <b>Description:</b> {nft.description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <input
              type="number"
              defaultValue={tokenPrice / 1e18}
              value={tokenPrice / 1e18}
              style={{
                marginRight: 50,
                borderRadius: 5,
                border: 0,
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                marginBottom: 10,
                padding: 10,
              }}
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
              style={{
                position: "absolute",
                right: 80,
                marginTop: 8,
              }}
            />
          </div>
          {Number(nft.status) == Status.ACTIVE &&
          nft.token_seller == address ? (
            <div className={styles["sell-button"]} onClick={cancelTokenListing}>
              Cancel listing
            </div>
          ) : (
            <div className={styles["sell-button"]} onClick={buyListedToken}>
              Buy token
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
