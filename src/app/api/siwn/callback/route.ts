import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY!;
    const clientId = process.env.NEYNAR_CLIENT_ID!;
    const code = req.nextUrl.searchParams.get("code");
    const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";

    if (!code) throw new Error("Missing code");

    // code'u Neynar ile takas et
    const res = await fetch("https://api.neynar.com/v2/siwn/callback", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        client_id: clientId,
        code,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "SIWN callback failed");

    // Dönen örnek alanlar:
    // data.user.fid, data.user.username, data.custody_address
    // data.signer_uuid (kullanıcı adına cast atmak için lazım)
    const session = {
      fid: data?.user?.fid,
      username: data?.user?.username,
      custody_address: data?.custody_address,
      signer_uuid: data?.signer_uuid,
      display_address: mask(data?.custody_address),
    };

    setSessionCookie(session);

    // Ana sayfaya dön (signedIn=1 ile)
    return NextResponse.redirect(new URL(`${returnTo}?signedIn=1`, req.url));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

function mask(addr?: string) {
  if (!addr || addr.length < 10) return addr || "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
