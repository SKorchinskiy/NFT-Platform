import styles from './provider-installation.module.css';

import { AddressContext } from '@/app/providers/address.provider';
import { PropsWithChildren, useContext } from 'react';
import ConnectWallet from '../connect-wallet/connect-wallet.component';

export default function ProviderInstallation({ children }: PropsWithChildren) {
  const { address } = useContext(AddressContext);
    
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return (
      <div className={styles["connection-container"]}>
        <div className={styles["connection-container-content"]}>
          <p>Please, install Metamask to proceed</p>
          <div
            className={styles["connect-wallet-container"]}
          >
            <a href='https://metamask.io/download/' style={{
              textDecoration: "none",
              color: "white",
              textTransform: "uppercase"
            }} target='_blank'>
              <p className={styles["connect-text-content"]}>
                Install Metamask
              </p>
            </a>
          </div>
        </div>
      </div>
    );
  } else if (!address) {
    return (
      <div className={styles["connection-container"]}>
        <div className={styles["connection-container-content"]}>
          <p>Please, connect via Metamask to proceed</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return address ? children : 
  <div className={styles["message-container"]}>
    <div className={styles["empty-container"]}>
      <p>You have no tokens associated with your address!</p>
    </div>
  </div>
}