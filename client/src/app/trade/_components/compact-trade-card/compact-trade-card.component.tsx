import StatusPlate from "@/app/portal/_components/status-plate/status-plate.component";
import styles from "./compact-trade-card.module.css";

import { NetworkContext } from "@/app/providers/network.provider";
import { TradeTokens } from "@/app/types/trade-tokens.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useMemo } from "react";

type CompactTradeCardProps = {
  token: TradeTokens & {
    name: string;
    image: string;
    external_url: string;
    description: string;
    attributes: Array<Object>;
  } & { mappedAuctionId: number };
};

export default function CompactTradeCard({ token }: CompactTradeCardProps) {
  const router = useRouter();

  const hasEnded: Boolean = useMemo(
    () => Date.now() / 1e3 - Number(token.auction_end_time) > 0,
    [token]
  );

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
        <div>
          <Image
            src={token.image.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt="nft"
            width={200}
            height={200}
          />
          <StatusPlate
            nft={{ ...token, status: hasEnded ? BigInt(5) : BigInt(4) }}
          />
        </div>
        <button
          className={styles["participation-button"]}
          onClick={() =>
            router.push("trade/" + Number(token.mappedAuctionId).toString())
          }
        >
          Participate
        </button>
      </div>
    </div>
  );
}
