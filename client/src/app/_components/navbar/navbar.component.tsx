"use client";

import { useContext, useState } from "react";
import ConnectWallet from "../connect-wallet/connect-wallet.component";
import AccountProfile from "../account-profile/account-profile.component";
import { AddressContext } from "@/app/providers/address.provider";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export type AddressInfo = {
  address: string;
  balance: bigint;
};

export default function Navbar() {
  const { address } = useContext(AddressContext);

  const router = useRouter();

  return (
    <div className={styles["nav-container"]}>
      <div className={styles["nav-right"]}>
        <div className={styles["nav-right-content"]}>
          <div
            className={styles["nav-option"]}
            onClick={() => router.push("/marketplace")}
          >
            Marketplace
          </div>
          <div
            className={styles["nav-option"]}
            onClick={() => router.push("/portal")}
          >
            Portal
          </div>
        </div>
      </div>
      <div className={styles["nav-left"]}>
        {address ? <AccountProfile /> : <ConnectWallet />}
      </div>
    </div>
  );
}
