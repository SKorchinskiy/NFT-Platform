import { Status } from "../nft-card/nft-card.component";

import styles from "./status-plate.module.css";

const params = {
  NONE: { background: "black" },
  CANCELED: { background: "yellow" },
  ACTIVE: { background: "green" },
  SOLD: { background: "red" },
  TRADE: { background: "green" },
  ENDED: { background: "red" },
} as {
  NONE: Object;
  CANCELED: Object;
  ACTIVE: Object;
  SOLD: object;
  TRADE: object;
  ENDED: object;
};

export default function StatusPlate({ nft }: { nft: { status: BigInt } }) {
  return (
    <div
      className={styles["status-plate-container"]}
      style={{
        background: (
          params[
            Status[Number(nft.status)].toString() as
              | "NONE"
              | "CANCELED"
              | "ACTIVE"
              | "SOLD"
              | "TRADE"
              | "ENDED"
          ] as { background: string }
        ).background,
      }}
    >
      {Status[Number(nft.status)]}
    </div>
  );
}
