import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl } = await req.json();
    const apiKey = process.env.NEYNAR_API_KEY!;

    if (!text) throw new Error("Text is required");

    const embeds: { url: string }[] = [];
    if (imageUrl?.startsWith("http")) {
      embeds.push({ url: imageUrl });
    }

    const body = {
      text,
      embeds,
    };

    const res = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": apiKey, // dikkat: x-api-key değil api_key
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Neynar API error");
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
