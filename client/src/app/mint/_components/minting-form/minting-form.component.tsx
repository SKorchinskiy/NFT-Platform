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
};

export default function MintingForm({
  onInputChange,
  onFileUpload,
  mintNftToken,
  mintAndListToken,
  onImageGenerate,
}: MintingFormProps) {
  const { address } = useContext(AddressContext);

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            width: "250px",
          }}
        >
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
