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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: 150,
        }}
      >
        <input
          placeholder="auction time in seconds..."
          type="number"
          style={{
            width: 200,
            padding: 15,
            borderRadius: 5,
            border: 0,
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
          }}
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
          style={{
            width: 200,
            padding: 15,
            borderRadius: 5,
            border: 0,
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
          }}
          onChange={(e) =>
            setTradeOptions((prev) => ({
              ...prev,
              initial_price: +e.target.value * 1e18,
            }))
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: 150,
        }}
      >
        <button
          style={{
            width: 200,
            padding: 15,
            borderRadius: 5,
            border: 0,
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            background: "#2D3250",
            color: "white",
          }}
          onClick={() => onTradePublish(tradeOptions)}
        >
          List for English Auction
        </button>
        <button
          style={{
            width: 200,
            padding: 15,
            borderRadius: 5,
            border: 0,
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
            background: "#2D3250",
            color: "white",
          }}
          onClick={() => onBlindAuctionPublish(tradeOptions)}
        >
          List for Blind Auction
        </button>
      </div>
    </div>
  );
}
