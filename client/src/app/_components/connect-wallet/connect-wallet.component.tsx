import { AddressContext } from "@/app/providers/address.provider";
import { MetamaskContext } from "@/app/providers/metamask.provider";
import Image from "next/image";
import { useContext } from "react";
import { Web3 } from "web3";

export default function ConnectWallet() {
  const { updateSelectedAddress } = useContext(AddressContext);
  const { provider } = useContext(MetamaskContext);

  const connectMetamask = async () => {
    console.log("connectMetamask called");
    if (provider) {
      try {
        const web3 = new Web3(provider);
        await provider.request({
          method: "eth_requestAccounts",
        });
        const addresses = await web3.eth.getAccounts();
        console.log(addresses);
        const connectedAddress = addresses[0];
        updateSelectedAddress(connectedAddress);

        provider.on("accountsChanged", async () => {
          const addresses = await web3.eth.getAccounts();
          console.log(addresses);
          const connectedAddress = addresses[0];
          updateSelectedAddress(connectedAddress);
        });
      } catch (error) {
        console.log("Metamask is not installed");
        alert("Install Metamask to proceed");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 30,
        background: "#F6851A",
        padding: "15px",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: "5px 3px 10px rgba(119, 59, 14)",
      }}
      onClick={connectMetamask}
    >
      <p
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          fontWeight: "bold",
          fontFamily: "monospace",
          fontSize: "14px",
          userSelect: "none",
        }}
      >
        {/* <Image src="/metamask-icon.png" alt="metamask" width={20} height={20} /> */}
        <span>Connect Wallet</span>
        {/* <Image src="/metamask-icon.png" alt="metamask" width={20} height={20} /> */}
      </p>
    </div>
  );
}
