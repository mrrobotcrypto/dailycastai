// src/app/api/siwf/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const res = await fetch("https://api.neynar.com/v2/auth/app/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api_key": process.env.NEYNAR_API_KEY! },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();
  // burada session’a yazabilirsin
  return NextResponse.json({ ok: true, user: data });
}
