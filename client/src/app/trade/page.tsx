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

export default function TradePage() {
  const [nftForTrade, setNftForTrade] = useState<NFT>({} as NFT);

  const selectedNftHandler = (nft: NFT) => setNftForTrade(nft);

  const englishAuctionContract = useEnglishAuctionContract();
  const nftCollectionContract = useNFTCollectionContract();
  const blindAuctionContract = useBlindAuctionContract();

  const { address } = useContext(AddressContext);
  const { network } = useContext(NetworkContext);
  const { tradeNFTs } = useContext(TradeTokensContext);

  const onTradePublish = async (trade_options: TRADE_OPTIONS) => {
    if (englishAuctionContract && nftCollectionContract && address) {
      await nftCollectionContract.methods
        .setApprovalForAll(network.contracts.englishAuctionContract, true)
        .send({ from: address });
      const response = await englishAuctionContract.methods
        .create_auction(
          trade_options.trade_time,
          nftForTrade.nft_contract || network.contracts.nftCollectionContract,
          nftForTrade.token_id,
          trade_options.initial_price
        )
        .send({ from: address });
      console.log({ response });
    }
  };

  const onBlindAuctionPublish = async (trade_options: TRADE_OPTIONS) => {
    if (blindAuctionContract && nftCollectionContract && address) {
      await nftCollectionContract.methods
        .setApprovalForAll(network.contracts.blindAuctionContract, true)
        .send({ from: address });
      const response = await blindAuctionContract.methods
        .create_auction(
          trade_options.trade_time,
          nftForTrade.nft_contract || network.contracts.nftCollectionContract,
          nftForTrade.token_id,
          trade_options.initial_price
        )
        .send({ from: address });
      console.log({ response });
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
