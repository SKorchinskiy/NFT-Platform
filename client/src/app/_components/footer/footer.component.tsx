import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <div className={styles["footer-container"]}>
      <div className={styles["footer-content"]}>
        <Image
          src={"/ethereum-sign.png"}
          alt="eth logo"
          width={33}
          height={50}
        />
        <Image
          src={"/binance-sign.png"}
          alt="eth logo"
          width={50}
          height={50}
        />
        <div className={"footer-details"}>
          <h3>Know how to improve the platform ?</h3>
          <div className={styles["footer-reach-out"]}>
            <a href="https://t.me/skorchinskiy" target="_blank">
              <Image
                src={"/telegram-sign.webp"}
                alt="tg logo"
                width={40}
                height={40}
                style={{ cursor: "pointer" }}
              />
            </a>
            <a
              href="https://github.com/skorchinskiy/nft-platform/issues"
              target="_blank"
            >
              <Image
                src={"/github-sign.png"}
                alt="gh logo"
                width={40}
                height={40}
                style={{ cursor: "pointer" }}
              />
            </a>
            <a href="mailto:ddphyk@gmail.com" target="_blank">
              <Image
                src={"/gmail-sign.png"}
                alt="gm logo"
                width={40}
                height={30}
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
        <Image
          src={"/polygon-sign.png"}
          alt="eth logo"
          width={50}
          height={50}
        />
        <Image
          src={"/hardhat-sign.png"}
          alt="eth logo"
          width={63}
          height={50}
        />
      </div>
    </div>
  );
}
