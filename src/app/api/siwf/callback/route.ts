import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code received" }, { status: 400 });
  }

  const res = await fetch("https://api.neynar.com/v2/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
      client_secret: process.env.NEYNAR_API_KEY,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/siwn/callback`,
      code,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error_description }, { status: 400 });
  }

  // access token & user bilgileri döner
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?fid=${data.user.fid}`);
}
