"use client";

import { useContext, useState } from "react";
import ConnectWallet from "../connect-wallet/connect-wallet.component";
import AccountProfile from "../account-profile/account-profile.component";
import { AddressContext } from "@/app/providers/address.provider";

export type AddressInfo = {
  address: string;
  balance: bigint;
};

export default function Navbar() {
  const { address } = useContext(AddressContext);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "80px",
      }}
    >
      <div
        className="nav-left"
        style={{
          position: "absolute",
          right: 50,
          top: 0,
        }}
      >
        {address ? <AccountProfile /> : <ConnectWallet />}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "2px",
          background: "white",
        }}
      />
    </div>
  );
}
