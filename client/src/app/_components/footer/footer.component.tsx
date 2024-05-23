import Image from "next/image";

export default function Footer() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        height: 150,
        width: "100%",
        background: "rgba(31, 37, 68, 0.5)",
        color: "white",
        bottom: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textTransform: "uppercase",
          }}
        >
          <h3>Know how to improve the platform ?</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
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
