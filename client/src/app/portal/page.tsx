"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import { AddressContext } from "../providers/address.provider";
import Web3 from "web3";
import { MetamaskContext } from "../providers/metamask.provider";

import MarketResellABI from "../../configs/market-resell.abi.json";
import NFTCollectionABI from "../../configs/nft-collection.abi.json";
import NFTCard from "./_components/nft-card/nft-card.component";
import { NFT as PureNFT } from "./_components/nft-card/nft-card.component";

type NFT = {
  status: BigInt;
  token_holder: string;
  token_id: BigInt;
  token_price: BigInt;
  token_seller: string;
};

export default function Portal() {
  const { address } = useContext(AddressContext);
  const [addressNftTokens, setAddressNftTokens] = useState<Array<Object>>([]);
  const [nftPureData, setNFTPureData] = useState<Array<PureNFT>>([]);

  const { provider } = useContext(MetamaskContext);

  useEffect(() => {
    const retrieveNftTokensFromAddress = async (contractAddress: string) => {
      if (provider && address) {
        const web3 = new Web3(provider);
        const resellContract = new web3.eth.Contract(
          MarketResellABI,
          "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          {
            from: address,
            gasPrice: "20000000000",
          }
        );
        console.log(resellContract);
        console.log("nft retr", address);
        const tokens = (await resellContract.methods.get_listed_nft().call({
          from: address,
        })) as Array<NFT>;
        const addressTokens = tokens.filter(
          (token: NFT) => token.token_seller == address
        ) as NFT[];
        setAddressNftTokens(addressTokens);
        console.log(addressTokens);
        // TODO separate to another function
        const nftCollection = new web3.eth.Contract(
          NFTCollectionABI,
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          {
            from: address,
            gasPrice: "20000000000",
          }
        );
        const tokenURIs = [];
        for (let token of addressTokens) {
          const tokenURI = (await nftCollection.methods
            .tokenURI(token.token_id)
            .call({
              from: address,
            })) as string;
          const ipfsURI = tokenURI.replace("ipfs://", `https://ipfs.io/ipfs/`);
          const data = await (await fetch(ipfsURI)).json();
          data.image = data.image.replace("ipfs://", `https://ipfs.io/ipfs/`);
          setNFTPureData((prevState) => [...prevState].concat(data));
        }
      }
    };

    retrieveNftTokensFromAddress("");
  }, [address, provider]);

  useEffect(() => {
    console.log({ nftPureData });
  }, [nftPureData]);

  return nftPureData ? (
    <Fragment>
      {nftPureData.map((nft, index) => (
        <NFTCard key={index} nft={nft} />
      ))}
    </Fragment>
  ) : null;
}
