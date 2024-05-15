"use client";

import styles from "./minting-form.module.css";

import useNftCreateContract from "@/app/hooks/useNftCreateContract.hook";
import useNftMarketContract from "@/app/hooks/useNftMarketContract.hook";
import { AddressContext } from "@/app/providers/address.provider";
import { NetworkContext } from "@/app/providers/network.provider";
import { PINATA_KEY } from "@/configs/constants";
import { ChangeEvent, useContext, useState } from "react";

const DEFAULT_FORM_INPUT = {
  name: "",
  description: "",
  price: 0,
};

export default function MintingForm() {
  const [nftImageFile, setNftImageFile] = useState<File>();
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
      setNftImageFile(file);
    }
  };

  const mintNftToken = async () => {
    if (
      nftImageFile &&
      formInput.description &&
      formInput.name &&
      nftCreateContract
    ) {
      const data = new FormData();
      data.append("file", nftImageFile);
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
      nftImageFile &&
      formInput.description &&
      formInput.name &&
      formInput.price &&
      nftCreateContract
    ) {
      const data = new FormData();
      data.append("file", nftImageFile);
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
    <div className={styles["minting-form-container"]}>
      <h3>Mint Your Own Token</h3>
      <input
        name="name"
        placeholder="Enter token name"
        type="text"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      <input
        name="description"
        placeholder="Enter token description"
        type="text"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      <input
        type="file"
        className={styles["file-upload-input"]}
        onChange={onFileUpload}
      />
      <input
        name="price"
        placeholder="Enter token price"
        type="number"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      <div className={styles["form-buttons-container"]}>
        <button
          className={styles["minting-form-button"]}
          onClick={() => mintNftToken()}
        >
          Mint Token
        </button>
        <button
          className={styles["minting-form-button"]}
          onClick={() => mintAndListToken()}
        >
          Mint & List Token
        </button>
      </div>
    </div>
  );
}
