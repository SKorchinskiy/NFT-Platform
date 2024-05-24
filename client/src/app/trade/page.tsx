"use client";

import styles from "./page.module.css";

import { useContext, useState } from "react";
import TokensWindow from "./_components/tokens-window/tokens-window.component";
import TradeSettings, {
  TRADE_OPTIONS,
} from "./_components/trade-settings/trade-settings.component";
import { NFT } from "../types/nft.type";
import useEnglishAuctionContract from "../hooks/useEnglishAuctionContract.hook";
import { AddressContext } from "../providers/address.provider";
import { NetworkContext } from "../providers/network.provider";
import TradeList from "./_components/trade-list/trade-list.component";
import { TradeTokensContext } from "../providers/trade-tokens.provider";
import useNFTCollectionContract from "../hooks/useNftCollectionContract.hook";
import useBlindAuctionContract from "../hooks/useBlindAuctionContract.hook";
import useNftMarketContract from "../hooks/useNftMarketContract.hook";
import useNftCreateContract from "../hooks/useNftCreateContract.hook";
import { AuctionsContext } from "../providers/auctions.provider";
import { TokensContext } from "../providers/nft-tokens.provider";
import { CustomTokensContext } from "../providers/custom-tokens.provider";

export default function TradePage() {
  const [nftForTrade, setNftForTrade] = useState<NFT>({} as NFT);

  const selectedNftHandler = (nft: NFT) => setNftForTrade(nft);

  const { network } = useContext(NetworkContext);

  const englishAuctionContract = useEnglishAuctionContract();
  const nftCollectionContract = useNFTCollectionContract();
  const blindAuctionContract = useBlindAuctionContract();
  const nftCreateContract = useNftCreateContract();

  const { address } = useContext(AddressContext);
  const { tradeNFTs } = useContext(TradeTokensContext);
  const { refreshAuctions } = useContext(AuctionsContext);
  const { refreshTokens } = useContext(TokensContext);
  const { refreshTokens: refreshCustomTokens } =
    useContext(CustomTokensContext);

  const onTradePublish = async (trade_options: TRADE_OPTIONS) => {
    if (
      englishAuctionContract &&
      nftCollectionContract &&
      nftCreateContract &&
      address
    ) {
      try {
        if (nftForTrade.nft_contract) {
          await nftCreateContract.methods
            .setApprovalForAll(network.contracts.englishAuctionContract, true)
            .send({ from: address });
        } else {
          await nftCollectionContract.methods
            .setApprovalForAll(network.contracts.englishAuctionContract, true)
            .send({ from: address });
        }
        await englishAuctionContract.methods
          .create_auction(
            trade_options.trade_time,
            nftForTrade.nft_contract || network.contracts.nftCollectionContract,
            nftForTrade.token_id,
            trade_options.initial_price
          )
          .send({ from: address });
        refreshAuctions();
        refreshTokens();
        refreshCustomTokens();
      } catch (e) {
        console.log({ e });
      }
    }
  };

  const onBlindAuctionPublish = async (trade_options: TRADE_OPTIONS) => {
    if (
      blindAuctionContract &&
      nftCollectionContract &&
      nftCreateContract &&
      address
    ) {
      try {
        if (nftForTrade.nft_contract) {
          await nftCreateContract.methods
            .setApprovalForAll(network.contracts.blindAuctionContract, true)
            .send({ from: address });
        } else {
          await nftCollectionContract.methods
            .setApprovalForAll(network.contracts.blindAuctionContract, true)
            .send({ from: address });
        }
        await blindAuctionContract.methods
          .create_auction(
            trade_options.trade_time,
            nftForTrade.nft_contract || network.contracts.nftCollectionContract,
            nftForTrade.token_id,
            trade_options.initial_price
          )
          .send({ from: address });
        refreshAuctions();
        refreshTokens();
        refreshCustomTokens();
      } catch (e) {
        console.log({ e });
      }
    }
  };

  return (
    <div>
      <div className={styles["trade-selector-container"]}>
        <TokensWindow
          nftForTrade={nftForTrade}
          selectedNftHandler={selectedNftHandler}
        />
        <TradeSettings
          onTradePublish={onTradePublish}
          onBlindAuctionPublish={onBlindAuctionPublish}
        />
      </div>
      <TradeList nfts={tradeNFTs} detailed={true} />
    </div>
  );
}
