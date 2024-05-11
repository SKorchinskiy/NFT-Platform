import { Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import ProfileDetails from "../profile-details/profile-details.component";
import { AddressContext } from "@/app/providers/address.provider";
import styles from "./account-profile.module.css";
import { BINANCE, ETHEREUM, HARDHAT, POLYGON } from "@/configs/networks";
import { NetworkContext } from "@/app/providers/network.provider";

export default function AccountProfile() {
  const { address, balance, updateSelectedAddress } =
    useContext(AddressContext);
  const [formatedAddress, setFormatedAddress] = useState<string>("");
  const [formatedBalance, setFormatedBalance] = useState<number>(0);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const toggleDetailsOpen = () => setDetailsOpen((prevState) => !prevState);

  const { network, switchNetwork } = useContext(NetworkContext);

  useEffect(() => {
    const head = address.slice(0, 5);
    const tail = address.slice(address.length - 5);
    setFormatedAddress(`${head}...${tail}`);
    setFormatedBalance(Number(balance) / 1e18);
  }, [address, balance]);

  return (
    <div
      style={{ height: detailsOpen ? 300 : 30 }}
      className={styles["account-profile-container"]}
      onClick={toggleDetailsOpen}
    >
      <ProfileDetails address={formatedAddress} balance={formatedBalance} />
      {detailsOpen ? (
        <Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "70%",
              width: "100%",
              overflow: "scroll",
            }}
          >
            {["Ethereum", "Binance", "Polygon", "Hardhat"].map(
              (network, index) => (
                <div
                  className={styles["chain-option"]}
                  key={index}
                  onClick={() => switchNetwork(network)}
                >
                  <span>{network}</span>
                </div>
              )
            )}
          </div>
          <div
            className={styles["address-switch-container"]}
            onClick={() => {}}
          >
            <Image
              src="/address-switch.png"
              alt="switch"
              width={30}
              height={30}
              style={{ userSelect: "none" }}
            />
          </div>
          <div
            className={styles["account-exit"]}
            onClick={() => updateSelectedAddress("")}
          >
            <Image
              src="/user-disconnect.png"
              alt="disconnect"
              width={30}
              height={30}
              style={{ userSelect: "none" }}
            />
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}
