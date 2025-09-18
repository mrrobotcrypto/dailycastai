import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const key = process.env.PEXELS_API_KEY;
    if (!key) return NextResponse.json({ images: [] });

    const q = encodeURIComponent(prompt || 'abstract minimal background');
    const r = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=6`, {
      headers: { Authorization: key }
    });
    if (!r.ok) return NextResponse.json({ images: [] });

    const j: any = await r.json();
    const images: string[] = (j.photos || []).map(
      (p: any) => p.src?.landscape || p.src?.large || p.src?.original
    ).filter(Boolean);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
