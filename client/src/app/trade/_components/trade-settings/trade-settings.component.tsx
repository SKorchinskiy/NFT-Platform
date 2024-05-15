import { useState } from "react";
import styles from "./trade-settings.module.css";

export type TRADE_OPTIONS = {
  trade_time: number;
};

const DEFAULT_TRADE_OPTIONS: TRADE_OPTIONS = {
  trade_time: 60,
};

export default function TradeSettings({
  onTradePublish,
}: {
  onTradePublish: Function;
}) {
  const [tradeOptions] = useState<TRADE_OPTIONS>(DEFAULT_TRADE_OPTIONS);

  return (
    <div className={styles["trade-settings-container"]}>
      <input
        placeholder="Input auction time in seconds..."
        style={{ width: 200, padding: 15 }}
      ></input>
      <button
        style={{ width: 200, padding: 15 }}
        onClick={() => onTradePublish(tradeOptions)}
      >
        List for English Auction
      </button>
    </div>
  );
}
