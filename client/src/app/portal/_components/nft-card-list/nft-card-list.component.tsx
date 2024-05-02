import NFTCard from "../nft-card/nft-card.component";

type CardListProps = {
  nfts: Array<{
    attributes: Array<Object>;
    description: string;
    external_url: string;
    image: string;
    name: string;
  }>;
};

export default function NFTCardList({ nfts }: CardListProps) {
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
          <NFTCard key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
}
