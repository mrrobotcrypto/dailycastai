import { NextRequest, NextResponse } from "next/server";
import { NeynarSIWNClient } from "@neynar/nodejs-sdk";

const client = new NeynarSIWNClient(process.env.NEYNAR_API_KEY!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // Neynar’dan access token al
    const data = await client.exchangeCodeForToken({
      code,
      clientId: process.env.NEYNAR_CLIENT_ID!,
      clientSecret: process.env.NEYNAR_CLIENT_SECRET!,
      redirectUri: process.env.NEYNAR_REDIRECT_URI!, // örn: http://localhost:3000/api/siwn/callback
    });

    return NextResponse.json({ user: data.user, token: data.accessToken });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
