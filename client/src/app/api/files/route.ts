import { NextRequest, NextResponse } from "next/server";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

async function createFile(url: string) {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = { type: "image/jpeg" };
  return new File([data], "test.jpg", metadata);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    let file: File | null = data.get("file") as unknown as File;
    if (typeof file === "string") {
      file = await createFile(file);
    }
    data.append("file", file);
    data.append("pinataMetadata", JSON.stringify({ name: data.get("name") }));

    const gcpSecretClient = new SecretManagerServiceClient();
    const [version] = await gcpSecretClient.accessSecretVersion({
      name: 'projects/349442864224/secrets/PINATA_KEY/versions/latest'
    });
    
    const PINATA_KEY = version.payload?.data?.toString() || '';

    const pinnedImage = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${PINATA_KEY}` },
      body: data,
    });

    const { IpfsHash } = await pinnedImage.json();
    
    const pinnedMetadata = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_KEY}`,
        },
        body: JSON.stringify({
          token_id: Number(data.get('token_id')),
          name: data.get('name'),
          description: data.get('description'),
          image: `ipfs://${IpfsHash}`,
        }),
      }
    );
    const { IpfsHash: IpfsCID } = await pinnedMetadata.json();

    return NextResponse.json({ IpfsCID }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
