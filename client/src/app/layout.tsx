"use client";

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

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import ProviderInstallation from "./_components/provider-installation/provider-installation.component";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "NFT-Platform - A fully-fledged Multichain platform",
  description:
    "A fully-fledged Multichain NFT-platform with ability to buy/sell/mint/trade ERC721 tokens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {init && (
          <Particles
            id="particles"
            options={{
              fpsLimit: 120,
              interactivity: {
                events: {
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 6,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                  },
                  value: 50,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />
        )}
        <MetamaskProvider>
          <NetworkProvider>
            <AddressProvider>
              <AuctionsProvider>
                <CustomTokensProvider>
                  <NftTokensProvider>
                    <TradeTokensProvider>
                      <BidsProvider>
                        <PopupProvider>
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              minHeight: "100vh",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Navbar />
                            <ProviderInstallation>
                              {children}
                            </ProviderInstallation>
                            <ActionPopup />
                            <Footer />
                          </div>
                        </PopupProvider>
                      </BidsProvider>
                    </TradeTokensProvider>
                  </NftTokensProvider>
                </CustomTokensProvider>
              </AuctionsProvider>
            </AddressProvider>
          </NetworkProvider>
        </MetamaskProvider>
      </body>
    </html>
  );
}
