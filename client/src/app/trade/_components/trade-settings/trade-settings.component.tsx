import { useState } from "react";
import styles from "./trade-settings.module.css";

export type TRADE_OPTIONS = {
  trade_time: number;
  initial_price: number;
};

const DEFAULT_TRADE_OPTIONS: TRADE_OPTIONS = {
  trade_time: 60,
  initial_price: 0,
};

export default function TradeSettings({
  onTradePublish,
  onBlindAuctionPublish,
}: {
  onTradePublish: Function;
  onBlindAuctionPublish: Function;
}) {
  const [tradeOptions, setTradeOptions] = useState<TRADE_OPTIONS>(
    DEFAULT_TRADE_OPTIONS
  );

  return (
    <div className={styles["trade-settings-container"]}>
      <div>
        <h3>Auction Details</h3>
      </div>
      <div className={styles["trade-settings"]}>
        <input
          placeholder="auction time in seconds..."
          type="number"
          className={styles["settings-field"]}
          onChange={(e) =>
            setTradeOptions((prev) => ({
              ...prev,
              trade_time: +e.target.value,
            }))
          }
        />
        <input
          placeholder="asset initial price..."
          type="number"
          className={styles["settings-field"]}
          onChange={(e) =>
            setTradeOptions((prev) => ({
              ...prev,
              initial_price: +e.target.value * 1e18,
            }))
          }
        />
      </div>
      <div className={styles["bid-buttons-container"]}>
        <button
          className={styles["bid-button"]}
          onClick={() => onTradePublish(tradeOptions)}
        >
          List for English Auction
        </button>
        <button
          className={styles["bid-button"]}
          onClick={() => onBlindAuctionPublish(tradeOptions)}
        >
          List for Blind Auction
        </button>
      </div>
    </div>
  );
}
