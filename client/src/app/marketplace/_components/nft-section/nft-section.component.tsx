import styles from "./nft-section.module.css";
import { PropsWithChildren } from "react";

export default function NftSection({
  heading,
  children,
}: { heading: string } & PropsWithChildren) {
  return (
    <div className={styles["nft-section"]}>
      <div className={styles["section-heading"]}>
        <p className={styles["section-heading-title"]}>
          <b>{heading}</b>
        </p>
      </div>
      {children}
    </div>
  );
}
