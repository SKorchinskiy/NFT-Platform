import { PINATA_KEY } from "@/configs/constants";
import { NextRequest, NextResponse } from "next/server";

export const config = { api: { bodaParser: false } };

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: data.get("name") }));

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${PINATA_KEY}` },
      body: data,
    });
    const { IpfsHash } = await res.json();

    return NextResponse.json({ IpfsHash }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
