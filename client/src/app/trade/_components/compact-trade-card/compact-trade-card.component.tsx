import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";
import styles from "./compact-trade-card.module.css";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokens } from "@/app/types/trade-tokens.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

type CompactTradeCardProps = {
  token: TradeTokens & {
    name: string;
    image: string;
    external_url: string;
    description: string;
    attributes: Array<Object>;
  };
};

export default function CompactTradeCard({ token }: CompactTradeCardProps) {
  const { network } = useContext(NetworkContext);

  const router = useRouter();

  return (
    <div
      className={styles["trade-card-container"]}
      style={{ position: "relative" }}
    >
      <div
        className={styles["trade-card-representation"]}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{}}>
          <Image
            src={token.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt="nft"
            width={200}
            height={200}
          />
          <StatusPlate nft={{ ...token, status: BigInt(4) }} />
        </div>
        <button
          className={styles["participation-button"]}
          onClick={() =>
            router.push("trade/" + Number(token.auction_id).toString())
          }
        >
          Participate
        </button>
      </div>
    </div>
  );
}
