"use client";

import ConnectWallet from "@/app/_components/connect-wallet/connect-wallet.component";
import styles from "./minting-form.module.css";

import { AddressContext } from "@/app/providers/address.provider";
import { ChangeEvent, useContext } from "react";

type MintingFormProps = {
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  mintNftToken: () => void;
  mintAndListToken: () => void;
  onImageGenerate: () => void;
  formInput: {
    name: string;
    description: string;
    price: number;
  };
};

export default function MintingForm({
  onInputChange,
  onFileUpload,
  mintNftToken,
  mintAndListToken,
  onImageGenerate,
  formInput,
}: MintingFormProps) {
  const { address } = useContext(AddressContext);

  return (
    <div className={styles["minting-form-container"]}>
      <h3>Mint Your Own Token</h3>
      <input
        name="name"
        placeholder="Enter token name"
        value={formInput.name}
        type="text"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      <input
        name="description"
        placeholder="Enter token description"
        value={formInput.description}
        type="text"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      <div className={styles["file-upload-container"]}>
        <input
          type="file"
          className={styles["file-upload-input"]}
          onChange={onFileUpload}
        />
        <div>OR</div>
        <button onClick={() => onImageGenerate()}>Generate with AI</button>
      </div>
      <input
        name="price"
        placeholder="Enter token price"
        value={formInput.price}
        type="number"
        className={styles["minting-form-field"]}
        onChange={onInputChange}
      />
      {address ? (
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
      ) : (
        <div className={styles["connection-container"]}>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
