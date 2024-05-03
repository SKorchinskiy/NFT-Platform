"use client";

import { useContext, useState } from "react";
import ConnectWallet from "../connect-wallet/connect-wallet.component";
import AccountProfile from "../account-profile/account-profile.component";
import { AddressContext } from "@/app/providers/address.provider";
import { useRouter } from "next/navigation";

export type AddressInfo = {
  address: string;
  balance: bigint;
};

export default function Navbar() {
  const { address } = useContext(AddressContext);

  const router = useRouter();

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
        className="nav-right"
        style={{
          position: "absolute",
          width: 500,
          left: 50,
          top: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              width: 150,
              padding: 20,
              textAlign: "center",
              background: "rgba(240, 236, 229, 0.9)",
              borderRadius: 5,
              boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
              fontFamily: "monospace",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/marketplace")}
          >
            Marketplace
          </div>
          <div
            style={{
              width: 150,
              padding: 20,
              textAlign: "center",
              background: "rgba(240, 236, 229, 0.9)",
              borderRadius: 5,
              boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.3)",
              fontFamily: "monospace",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => router.push("/portal")}
          >
            Portal
          </div>
        </div>
      </div>
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
