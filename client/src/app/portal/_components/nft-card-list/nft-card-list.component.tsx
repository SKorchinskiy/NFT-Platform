import { Fragment, useContext, useState } from "react";
import NFTCard from "../nft-card/nft-card.component";
import { TokensContext } from "@/app/providers/nft-tokens.provider";
import NFTCardModal from "../nft-card-modal/nft-card-modal.component";

export type NFT = {
  attributes: Array<Object>;
  description: string;
  external_url: string;
  image: string;
  name: string;
  status: BigInt;
  token_holder: string;
  token_id: BigInt;
  token_price: BigInt;
  token_seller: string;
};

export type NFTs = Array<NFT>;

export default function NFTCardList({ nfts }: { nfts: Array<NFT> }) {
  const [activeToken, setActiveToken] = useState<number>(0);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);

  const toggleIsCardModalOpen = () =>
    setIsCardModalOpen((prevState) => !prevState);

  const activeTokenHandler = (tokenInd: number) => setActiveToken(tokenInd);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: "auto",
        background: "rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 300px)",
          rowGap: "50px",
          padding: "50px",
        }}
      >
        {nfts.map((nft, index) => (
          <NFTCard
            key={index}
            nft={nft}
            isCardModalOpen={isCardModalOpen}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            activeTokenHandler={activeTokenHandler}
          />
        ))}
      </div>
      {isCardModalOpen ? (
        <Fragment>
          <NFTCardModal
            tokenIndex={activeToken}
            toggleIsCardModalOpen={toggleIsCardModalOpen}
            activeTokenHandler={activeTokenHandler}
          />
          <div
            style={{
              position: "absolute",
              top: -100,
              bottom: -200,
              left: -100,
              right: -100,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            }}
          />
        </Fragment>
      ) : null}
    </div>
  );
}
