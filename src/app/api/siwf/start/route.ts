// src/app/api/siwf/start/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEYNAR_API_KEY!;
  const res = await fetch("https://api.neynar.com/v2/auth/app/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api_key": apiKey },
    body: JSON.stringify({
      redirect_uri: "https://seninsite.com/api/siwf/callback"
    }),
  });

  const data = await res.json();
  return NextResponse.json({ url: data.url });
}
