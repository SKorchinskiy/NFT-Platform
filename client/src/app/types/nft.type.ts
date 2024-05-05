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
