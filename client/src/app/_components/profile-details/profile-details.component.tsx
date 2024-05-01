import Image from "next/image";

type ProfileDetailsParams = {
  address: string;
  balance: number;
};

export default function ProfileDetails({
  address,
  balance,
}: ProfileDetailsParams) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <p
          style={{
            userSelect: "none",
          }}
        >
          {address}
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
            userSelect: "none",
          }}
        >
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
          style={{
            userSelect: "none",
          }}
        />
      </div>
    </div>
  );
}
