import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl } = await req.json();
    if (!text) throw new Error("Missing text");

    const apiKey = process.env.NEYNAR_API_KEY!;
    const session = getSessionFromCookie();
    if (!session?.signer_uuid) {
      throw new Error("Not signed in");
    }

    const embeds: any[] = [];
    if (imageUrl?.startsWith("http")) embeds.push({ url: imageUrl });

    const res = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        signer_uuid: session.signer_uuid,
        text,
        embeds,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.cast?.hash) {
      throw new Error(data?.message || "Cast API error");
    }

    return NextResponse.json({ ok: true, hash: data.cast.hash });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
