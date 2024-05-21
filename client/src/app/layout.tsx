import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./_components/navbar/navbar.component";
import AddressProvider from "./providers/address.provider";
import MetamaskProvider from "./providers/metamask.provider";
import "./global.styles.css";
import NftTokensProvider from "./providers/nft-tokens.provider";
import ActionPopup from "./_components/action-popup/action-popup.component";
import PopupProvider from "./providers/popup.provider";
import CustomTokensProvider from "./providers/custom-tokens.provider";
import NetworkProvider from "./providers/network.provider";
import TradeTokensProvider from "./providers/trade-tokens.provider";
import BidsProvider from "./providers/bids.provider";
import Footer from "./_components/footer/footer.component";
import AuctionsProvider from "./providers/auctions.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NFT-Platform - A fully-fledged Multichain platform",
  description:
    "A fully-fledged Multichain NFT-platform with ability to buy/sell/mint/trade ERC721 tokens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MetamaskProvider>
          <NetworkProvider>
            <AddressProvider>
              <AuctionsProvider>
                <NftTokensProvider>
                  <CustomTokensProvider>
                    <TradeTokensProvider>
                      <BidsProvider>
                        <PopupProvider>
                          <Navbar />
                          {children}
                          <Footer />
                          <ActionPopup />
                        </PopupProvider>
                      </BidsProvider>
                    </TradeTokensProvider>
                  </CustomTokensProvider>
                </NftTokensProvider>
              </AuctionsProvider>
            </AddressProvider>
          </NetworkProvider>
        </MetamaskProvider>
      </body>
    </html>
  );
}
