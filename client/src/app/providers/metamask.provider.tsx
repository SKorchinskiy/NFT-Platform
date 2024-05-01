"use client";

import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";

export const MetamaskContext = createContext({
  provider: null,
} as {
  provider: MetaMaskInpageProvider | null;
});

export default function MetamaskProvider({ children }: PropsWithChildren) {
  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);

  useEffect(() => {
    const retrieveMetamaskProvider = () => {
      // @ts-ignore
      const metamaskProvider = window.ethereum as MetaMaskInpageProvider;
      setProvider(metamaskProvider);
    };

    retrieveMetamaskProvider();
  }, []);

  return (
    // @ts-ignore
    <MetamaskContext.Provider value={{ provider }}>
      {children}
    </MetamaskContext.Provider>
  );
}
