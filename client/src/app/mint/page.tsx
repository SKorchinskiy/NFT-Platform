"use client";

import styles from "./page.module.css";
import MintingForm from "./_components/minting-form/minting-form.component";
import MintingConstructor from "./_components/minting-constructor/minting-constructor.component";
import { ChangeEvent, Fragment, useContext, useState } from "react";
import { AddressContext } from "../providers/address.provider";
import { NetworkContext } from "../providers/network.provider";
import useNftCreateContract from "../hooks/useNftCreateContract.hook";
import useNftMarketContract from "../hooks/useNftMarketContract.hook";

import { TokensContext } from "../providers/nft-tokens.provider";
import { CustomTokensContext } from "../providers/custom-tokens.provider";

const DEFAULT_FORM_INPUT = {
  name: "",
  description: "",
  price: 0,
};

export default function MintPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [aiTokenGen, setAiTokenGen] = useState(false);
  const [nftImage, setNftImage] = useState<File | string>("");
  const [formInput, setFormInput] = useState(DEFAULT_FORM_INPUT);

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);

  const nftCreateContract = useNftCreateContract();
  const nftMarketContract = useNftMarketContract();

  const { refreshTokens } = useContext(TokensContext);
  const { refreshTokens: refreshCustomTokens } =
    useContext(CustomTokensContext);

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
    try {
      let data = new FormData();
      data.append("prompt", formInput.name);
      setAiTokenGen(true);
      const res = await fetch("/api/images", {
        method: "POST",
        body: data,
      });
      const { image_url } = await res.json();
      setNftImage(image_url);
    } catch (e) {
      console.log({ e });
    }
  };

  const mintNftToken = async () => {
    if (
      nftImage &&
      formInput.description &&
      formInput.name &&
      nftCreateContract
    ) {
      try {
        const token_id =
          Number(
            (await nftCreateContract.methods.counter().call({
              from: address,
            })) as BigInt
          ) + 1;

        const data = new FormData();
        data.append("file", nftImage);
        data.append("name", formInput.name);
        data.append("token_id", token_id.toString());
        data.append("description", formInput.description);

        const res = await fetch("/api/files", {
          method: "POST",
          body: data,
        });

        const { IpfsCID } = await res.json();

        const ipfsURI = "ipfs://" + IpfsCID;
        await nftCreateContract.methods
          .mint_token(ipfsURI)
          .send({ from: address, value: "75000000000000" });

        refreshTokens();
        refreshCustomTokens();
        setNftImage("");
        setFormInput(DEFAULT_FORM_INPUT);
        setShowOverlay(true);
      } catch (e) {
        console.log({ e });
      }
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
      try {
        const token_id =
          Number(
            (await nftCreateContract.methods.counter().call({
              from: address,
            })) as BigInt
          ) + 1;

        const data = new FormData();
        data.append("file", nftImage);
        data.append("name", formInput.name);
        data.append("token_id", token_id.toString());
        data.append("description", formInput.description);

        const res = await fetch("/api/files", { method: "POST", body: data });
        const { IpfsCID } = await res.json();

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
            .send({ from: address, value: "25000000000000" });
        }
        
        refreshTokens();
        refreshCustomTokens();
        setNftImage("");
        setFormInput(DEFAULT_FORM_INPUT);
        setShowOverlay(true);
      } catch (e) {
        console.log({ e });
      }
    }
  };

  return (
    <Fragment>
      <div className={styles["minting-container"]}>
        <MintingConstructor nftImage={nftImage} formInput={formInput} />
        <MintingForm
          formInput={formInput}
          onInputChange={onInputChange}
          onFileUpload={onFileUpload}
          mintNftToken={mintNftToken}
          mintAndListToken={mintAndListToken}
          onImageGenerate={onImageGenerate}
        />
      </div>
      {showOverlay ? (
        <div className={styles["overlay-container"]}>
          <div className={styles["overlay-content-container"]}>
            <div>
              <p>Your token was successfully minted!</p>
              <p>It can take several minutes for token to be available.</p>
            </div>
            <div
              className={styles["overlay-close-button"]}
              onClick={() => setShowOverlay(false)}
            >
              <span>OK</span>
            </div>
          </div>
        </div>
      ) : null}
      {aiTokenGen ? (
        <div className={styles["overlay-container"]}>
          <div className={styles["overlay-content-container"]}>
            <div>
              <p>Generating token image with AI can take a while...</p>
            </div>
            <div
              className={styles["overlay-close-button"]}
              onClick={() => setAiTokenGen(false)}
            >
              <span>OK</span>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}
