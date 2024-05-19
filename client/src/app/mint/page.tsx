"use client";

import styles from "./page.module.css";
import MintingForm from "./_components/minting-form/minting-form.component";
import MintingConstructor from "./_components/minting-constructor/minting-constructor.component";
import { ChangeEvent, useContext, useState } from "react";
import { AddressContext } from "../providers/address.provider";
import { NetworkContext } from "../providers/network.provider";
import useNftCreateContract from "../hooks/useNftCreateContract.hook";
import useNftMarketContract from "../hooks/useNftMarketContract.hook";

import { PINATA_KEY } from "@/configs/constants";

const DEFAULT_FORM_INPUT = {
  name: "",
  description: "",
  price: 0,
};

export default function MintPage() {
  const [nftImage, setNftImage] = useState<File | string>("");
  const [formInput, setFormInput] = useState(DEFAULT_FORM_INPUT);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const nftCreateContract = useNftCreateContract();
  const nftMarketContract = useNftMarketContract();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setNftImage(file);
    }
  };

  const onImageGenerate = async () => {
    let data = new FormData();
    data.append("prompt", formInput.name);
    const res = await fetch("/api/images", {
      method: "POST",
      body: data,
    });
    const { image_url } = await res.json();
    setNftImage(image_url);
  };

  const mintNftToken = async () => {
    if (
      nftImage &&
      formInput.description &&
      formInput.name &&
      nftCreateContract
    ) {
      const data = new FormData();
      data.append("file", nftImage);
      data.append("name", formInput.name);

      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });

      const { IpfsHash } = await res.json();

      const token_id =
        Number(
          (await nftCreateContract.methods.counter().call({
            from: address,
          })) as BigInt
        ) + 1;

      const res2 = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_KEY}`,
          },
          body: JSON.stringify({
            token_id,
            name: formInput.name,
            description: formInput.description,
            image: `ipfs://${IpfsHash}`,
          }),
        }
      );
      const { IpfsHash: IpfsCID } = await res2.json();

      const ipfsURI = "ipfs://" + IpfsCID;

      const resp = await nftCreateContract?.methods
        .mint_token(ipfsURI)
        .send({ from: address, value: "7500000000000000" });
    }
  };

  const mintAndListToken = async () => {
    if (
      nftImage &&
      formInput.description &&
      formInput.name &&
      formInput.price &&
      nftCreateContract
    ) {
      const data = new FormData();
      data.append("file", nftImage);
      data.append("name", formInput.name);

      const res = await fetch("/api/files", { method: "POST", body: data });
      const { IpfsHash } = await res.json();

      const token_id =
        Number(
          (await nftCreateContract.methods.counter().call({
            from: address,
          })) as BigInt
        ) + 1;

      const res2 = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_KEY}`,
          },
          body: JSON.stringify({
            token_id,
            name: formInput.name,
            description: formInput.description,
            image: `ipfs://${IpfsHash}`,
            token_price: Number(formInput.price * 1e18).toString(),
          }),
        }
      );
      const { IpfsHash: IpfsCID } = await res2.json();

      const ipfsURI = "ipfs://" + IpfsCID;

      const resp = await nftCreateContract.methods
        .create_token_wrapper(ipfsURI)
        .send({ from: address });

      if (resp && resp.events) {
        const token_id = Number(
          resp.events.TokenWrapperCreated.returnValues.token_id
        );
        await nftMarketContract?.methods
          .create_nft_asset(
            network.contracts.nftCreateContract,
            token_id,
            formInput.price * 1e18
          )
          .send({ from: address, value: "2500000000000000" });
      }
    }
  };

  return (
    <div className={styles["minting-container"]}>
      <MintingConstructor nftImage={nftImage} formInput={formInput} />
      <MintingForm
        onInputChange={onInputChange}
        onFileUpload={onFileUpload}
        mintNftToken={mintNftToken}
        mintAndListToken={mintAndListToken}
        onImageGenerate={onImageGenerate}
      />
    </div>
  );
}
