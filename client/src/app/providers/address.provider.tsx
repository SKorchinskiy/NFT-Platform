"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Web3 } from "web3";
import { MetamaskContext } from "./metamask.provider";

export const AddressContext = createContext({
  address: "",
  balance: BigInt(0),
  updateSelectedAddress: (_: string) => {},
});

export default function AddressProvider({ children }: PropsWithChildren) {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const { provider } = useContext(MetamaskContext);

  const updateSelectedAddress = (newAddress: string) => setAddress(newAddress);

  useEffect(() => {
    const updateAddressBalance = async (address: string) => {
      if (provider) {
        try {
          const web3 = new Web3(provider);
          const currentBalance = await web3.eth.getBalance(address);
          setBalance(currentBalance);
        } catch (error) {
          console.log("Metamask is not installed");
        }
      }
    };

    updateAddressBalance(address);
  }, [address, provider]);

  return (
    <AddressContext.Provider
      value={{
        address,
        balance,
        updateSelectedAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}
