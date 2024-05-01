import Image from "next/image";

export type NFT = {
  nft: {
    attributes: Array<Object>;
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
};

export default function NFTCard({ nft }: NFT) {
  return nft.image ? (
    <div>
      <Image src={nft.image} alt="nft" width={100} height={100}></Image>
      <p>Name: {nft.name}</p>
      <p>Description: {nft.description}</p>
    </div>
  ) : null;
}
