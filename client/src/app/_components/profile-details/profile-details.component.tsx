import Image from "next/image";
import styles from "./profile-details.module.css";

type ProfileDetailsParams = {
  address: string;
  balance: number;
};

export default function ProfileDetails({
  address,
  balance,
}: ProfileDetailsParams) {
  return (
    <div className={styles["profile-details-container"]}>
      <div className={styles["details-content"]}>
        <p style={{ userSelect: "none" }}>{address}</p>
        <p className={styles["balance-info"]}>
          <span>{balance}</span>
          <span>ETH</span>
        </p>
      </div>
      <div>
        <Image
          src="/user-icon.png"
          width={40}
          height={30}
          alt="user"
          style={{ userSelect: "none" }}
        />
      </div>
    </div>
  );
}
