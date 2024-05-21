import Image from "next/image";

export default function Footer() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        height: 200,
        width: "100%",
        background: "rgba(250, 250, 250, 0.8)",
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
          width={65}
          height={100}
        />
        <Image
          src={"/binance-sign.png"}
          alt="eth logo"
          width={100}
          height={100}
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
          <p>Get in touch with us</p>
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
                width={50}
                height={50}
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
                width={50}
                height={50}
                style={{ cursor: "pointer" }}
              />
            </a>
            <a href="mailto:ddphyk@gmail.com" target="_blank">
              <Image
                src={"/gmail-sign.png"}
                alt="gm logo"
                width={50}
                height={40}
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
        <Image
          src={"/polygon-sign.png"}
          alt="eth logo"
          width={100}
          height={100}
        />
        <Image
          src={"/hardhat-sign.png"}
          alt="eth logo"
          width={125}
          height={100}
        />
      </div>
    </div>
  );
}
