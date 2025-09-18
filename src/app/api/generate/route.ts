// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const schema = z.object({
  topic: z.string().min(2).max(120),
  tone: z.enum(["plain", "witty", "professional"]).default("plain"),
  style: z.enum(["photo-realistic", "illustration", "3D", "minimal"]).default("illustration"),
  skipImage: z.boolean().optional(),
  lang: z.enum(["tr", "en"]).default("tr")
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function fallbackText(topic: string, tone: "plain"|"witty"|"professional", lang: "tr"|"en") {
  const tt = lang === 'tr'
    ? (tone === 'witty' ? 'esprili' : tone === 'professional' ? 'profesyonel' : 'sade')
    : tone; // en: use as-is
  return lang === 'tr'
    ? `Bugün "${topic}" hakkında ${tt} ve kısa bir not: ana mesajı net tut, okuyanlara tek bir fayda sun ve küçük bir eylem çağrısıyla bitir. İki küçük içgörü eklemek akılda kalıcılığı artırır; gereksiz süslemeleri at. #günlük #paylaşım`
    : `A short and ${tt} note about “${topic}”: keep one core message, deliver a single practical value, and close with a tiny call-to-action. Two small insights help retention; drop the fluff. #daily #share`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, tone, style, skipImage, lang } = schema.parse(body);

    // 1) TEXT (seçilen dile göre)
    let text = '';
    const forceFallback = process.env.DEV_FALLBACK === '1' || !process.env.OPENAI_API_KEY?.startsWith('sk-');

    if (!forceFallback) {
      try {
        const sys =
          lang === 'tr'
            ? 'You are a concise content editor. Write in Turkish, single paragraph, 70–100 words, no emoji. Structure: one core message + 1–2 insights + one small call-to-action + 1–2 hashtags.'
            : 'You are a concise content editor. Write in English, single paragraph, 70–100 words, no emoji. Structure: one core message + 1–2 insights + one small call-to-action + 1–2 hashtags.';
        const msg = `Topic: ${topic}\nTone: ${tone}`;
        const chat = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: sys }, { role: 'user', content: msg }],
          temperature: 0.7,
          max_tokens: 200
        });
        text = chat.choices[0]?.message?.content?.trim() || '';
        if (!text) text = fallbackText(topic, tone, lang);
      } catch {
        text = fallbackText(topic, tone, lang);
      }
    } else {
      text = fallbackText(topic, tone, lang);
    }

    // Kullanıcı görsel seçtiyse ya da kapatma bayrağı varsa, direkt dön
    if (skipImage || process.env.DISABLE_IMAGE === '1') {
      return NextResponse.json({ text });
    }

    // 2) GÖRSEL: önce PEXELS (ücretsiz)
    if (process.env.PEXELS_API_KEY) {
      try {
        const q = encodeURIComponent(topic);
        const r = await fetch(`https://api.pexels.com/v1/search?query=${q}&per_page=1`, {
          headers: { Authorization: process.env.PEXELS_API_KEY! }
        });
        if (r.ok) {
          const j: any = await r.json();
          const url =
            j?.photos?.[0]?.src?.landscape ||
            j?.photos?.[0]?.src?.large ||
            j?.photos?.[0]?.src?.original;
          if (url) return NextResponse.json({ text, imageUrl: url });
        }
      } catch { /* yoksay */ }
    }

    // 3) (Opsiyonel) OpenAI image — bütçe varsa
    try {
      const prompt = `Topic: ${topic}. Style: ${style}. Square composition, clean background, high contrast, social-media ready, readable.`;
      const img = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x1024' });
      const b64 = img.data[0].b64_json!;
      const imageUrl = `data:image/png;base64,${b64}`;
      return NextResponse.json({ text, imageUrl });
    } catch {
      const imageUrl = `https://placehold.co/1024x1024/png?text=${encodeURIComponent(topic)}`;
      return NextResponse.json({ text, imageUrl });
    }
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
