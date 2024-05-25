import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { REPLICATE_API_TOKEN } from "@/configs/constants";

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const prompt: string = data.get("prompt") as string;

    const links = (await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: { prompt },
      }
    )) as Array<string>;

    return NextResponse.json({ image_url: links[0] }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
