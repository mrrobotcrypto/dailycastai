import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY!;
    const clientId = process.env.NEYNAR_CLIENT_ID!;
    const base = process.env.PUBLIC_BASE_URL!;
    const returnTo = req.nextUrl.searchParams.get("returnTo") || "/";

    // SIWN start – Neynar REST
    const res = await fetch("https://api.neynar.com/v2/siwn/start", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        client_id: clientId,
        redirect_uri: `${base}/api/siwn/callback?returnTo=${encodeURIComponent(
          returnTo
        )}`,
        // optional state eklemek istersen:
        state: Math.random().toString(36).slice(2),
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.siwn_url) {
      throw new Error(data?.message || "SIWN start failed");
    }

    // Frontend bu URL’e yönlendirecek
    return NextResponse.json({ url: data.siwn_url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
