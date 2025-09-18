import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, imageUrl } = await req.json();
    const apiKey = process.env.NEYNAR_API_KEY!;
    const signer = process.env.NEYNAR_SIGNER_UUID!;

    const embeds:any[] = [];
    if (imageUrl?.startsWith('http')) embeds.push({ url: imageUrl });

    const res = await fetch('https://api.neynar.com/v2/farcaster/cast/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ signer_uuid: signer, text, embeds })
    });

    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Neynar cast API error');

    return NextResponse.json({ ok: true, hash: data.cast?.hash });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
