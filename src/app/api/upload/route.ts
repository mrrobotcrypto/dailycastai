// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const type = file.type || 'application/octet-stream';
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(type)) {
      return NextResponse.json({ error: 'Only PNG/JPG allowed' }, { status: 400 });
    }
    const buf = new Uint8Array(await file.arrayBuffer());
    if (buf.byteLength > 6 * 1024 * 1024) { // 6 MB sınır
      return NextResponse.json({ error: 'File too large (max 6MB)' }, { status: 400 });
    }

    const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const key = `dailycast/${Date.now()}-${safeName || 'image'}`;
    const { url } = await put(key, buf, {
      access: 'public',
      contentType: type,
      addRandomSuffix: false
    });

    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'upload failed' }, { status: 500 });
  }
}
