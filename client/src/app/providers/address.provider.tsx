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
import { NetworkContext } from "./network.provider";

export const AddressContext = createContext({
  address: "",
  balance: BigInt(0),
  updateSelectedAddress: (_: string) => {},
});

export default function AddressProvider({ children }: PropsWithChildren) {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const { provider } = useContext(MetamaskContext);
  const { network } = useContext(NetworkContext);

  const updateSelectedAddress = (newAddress: string) => setAddress(newAddress);

  useEffect(() => {
    const updateAddressBalance = async (address: string) => {
      if (provider) {
        try {
          (async () => {
            const web3 = new Web3(provider);
            const currentBalance = await web3.eth.getBalance(address);
            setBalance(currentBalance);
          })();

          const currentBalance = (await new Promise(async (resolve) => {
            await new Promise((r) => setTimeout(r, 3000));
            const web3 = new Web3(provider);
            const currentBalance = await web3.eth.getBalance(address);
            resolve(currentBalance);
          })) as bigint;

          setBalance(currentBalance);
        } catch (error) {
          console.log("Metamask is not installed");
        }
      }
    };
    if (address && network) updateAddressBalance(address);
  }, [address, provider, network]);

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
