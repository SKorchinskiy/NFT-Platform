import { Fragment, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AddressInfo } from "../navbar/navbar.component";
import ProfileDetails from "../profile-details/profile-details.component";
import { AddressContext } from "@/app/providers/address.provider";

export default function AccountProfile() {
  const { address, balance, updateSelectedAddress } =
    useContext(AddressContext);
  const [formatedAddress, setFormatedAddress] = useState<string>("");
  const [formatedBalance, setFormatedBalance] = useState<number>(0);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const toggleDetailsOpen = () => setDetailsOpen((prevState) => !prevState);

  useEffect(() => {
    const head = address.slice(0, 5);
    const tail = address.slice(address.length - 5);
    setFormatedAddress(`${head}...${tail}`);
    setFormatedBalance(Number(balance) / 1e18);
  }, [address, balance]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: detailsOpen ? 300 : 30,
        padding: "15px",
        background: "#F6851A",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "5px 3px 10px rgba(119, 59, 14)",
        position: "absolute",
        zIndex: 1,
        right: 0,
      }}
      onClick={toggleDetailsOpen}
    >
      <ProfileDetails address={formatedAddress} balance={formatedBalance} />
      {detailsOpen ? (
        <Fragment>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 5,
            }}
            onClick={() => {}}
          >
            <Image
              src="/address-switch.png"
              alt="switch"
              width={30}
              height={30}
              style={{
                userSelect: "none",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 5,
            }}
            onClick={() => updateSelectedAddress("")}
          >
            <Image
              src="/user-disconnect.png"
              alt="disconnect"
              width={30}
              height={30}
              style={{
                userSelect: "none",
              }}
            />
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}
