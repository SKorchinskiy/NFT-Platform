import { AddressContext } from "@/app/providers/address.provider";
import { MetamaskContext } from "@/app/providers/metamask.provider";
import { useContext } from "react";
import { Web3 } from "web3";
import styles from "./connect-wallet.module.css";

export default function ConnectWallet() {
  const { updateSelectedAddress } = useContext(AddressContext);
  const { provider } = useContext(MetamaskContext);

  const connectMetamask = async () => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        await provider.request({
          method: "eth_requestAccounts",
        });
        const addresses = await web3.eth.getAccounts();
        const connectedAddress = addresses[0];
        updateSelectedAddress(connectedAddress);

        provider.on("accountsChanged", async () => {
          const addresses = await web3.eth.getAccounts();
          const connectedAddress = addresses[0];
          updateSelectedAddress(connectedAddress);
        });
      } catch (error) {
        alert("Install Metamask to proceed");
      }
    }
  };

  return (
    <div
      className={styles["connect-wallet-container"]}
      onClick={connectMetamask}
    >
      <p className={styles["connect-text-content"]}>
        <span>Connect Wallet</span>
      </p>
    </div>
  );
}
