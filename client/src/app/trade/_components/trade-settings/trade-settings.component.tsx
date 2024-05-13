import { useState } from "react";

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
  const [tradeOptions, setTradeOptions] = useState<TRADE_OPTIONS>(
    DEFAULT_TRADE_OPTIONS
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        width: 600,
        height: 500,
        background: "blue",
      }}
    >
      <input
        placeholder="Input auction time in seconds..."
        style={{
          width: 200,
          padding: 15,
        }}
      ></input>
      <button
        style={{
          width: 200,
          padding: 15,
        }}
        onClick={() => onTradePublish(tradeOptions)}
      >
        List for English Auction
      </button>
    </div>
  );
}
