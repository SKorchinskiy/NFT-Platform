import { Status } from "../nft-card/nft-card.component";

const params = {
  NONE: {
    background: "black",
  },
  CANCELED: {
    background: "yellow",
  },
  ACTIVE: {
    background: "green",
  },
  SOLD: {
    background: "red",
  },
} as { NONE: Object; CANCELED: Object; ACTIVE: Object; SOLD: object };

export default function StatusPlate({ nft }: { nft: { status: BigInt } }) {
  return (
    <div
      style={{
        position: "absolute",
        transform: "rotate(-30deg)",
        background: (
          params[
            Status[Number(nft.status)].toString() as
              | "NONE"
              | "CANCELED"
              | "ACTIVE"
              | "SOLD"
          ] as {
            background: string;
          }
        ).background,
        color: "white",
        padding: 5,
        width: 170,
        textAlign: "center",
        zIndex: 1,
        top: 16,
        left: -20,
        // borderRadius: 5,
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
        clipPath: "polygon(9.8% 0%, 70% 0%, 98.5% 100%, 0.2% 100%)",
      }}
    >
      {Status[Number(nft.status)]}
    </div>
  );
}
