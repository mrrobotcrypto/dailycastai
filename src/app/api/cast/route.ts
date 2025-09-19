import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl } = await req.json();
    const apiKey = process.env.NEYNAR_API_KEY!;

    // Neynar body formatı
    const body: any = { text };
    if (imageUrl?.startsWith("http")) {
      body.embeds = [imageUrl]; // Düz array olacak, obje değil
    }

    const res = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": apiKey, // Neynar API key buraya
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Neynar cast API error");
    }

    return NextResponse.json({ ok: true, cast: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
