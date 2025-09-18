// src/lib/i18n.ts
export type Lang = "tr" | "en";

export const UI = {
  tr: {
    subtitle: "Bir konu gir → 1 paragraf + görsel → Paylaş.",
    labels: {
      topic: "Konu",
      tone: "Ton",
      style: "Stil",
      generate: "Metin + Görsel Üret",
      regenerate: "Yeniden üret",
      share: "Paylaş",
      topicPH: "Bugünün konusu nedir? (ör. Base için hızlı bir ipucu)",
    },
    tones: { plain: "sade", witty: "esprili", professional: "profesyonel" },
    styles: { "photo-realistic": "foto-gerçekçi", illustration: "illüstrasyon", "3D": "3D", minimal: "minimal" },
    presets: [
      { label: "Günün kripto haberleri", topic: "Bugünün kripto piyasası özeti: 3 başlık ve çok kısa yorum; sonunda tek cümle CTA ve 1–2 hashtag.", tone: "professional" },
      { label: "Günün sözü", topic: "Kripto/teknoloji kültürüne uygun kısa ilham verici söz; tek paragraf yorum ve küçük CTA; 1–2 hashtag.", tone: "plain" },
      { label: "Günaydın mesajı", topic: "Kripto topluluğuna pozitif bir günaydın mesajı; günün kısa hedefi ve minik CTA; 1–2 hashtag.", tone: "witty" },
      { label: "İyi geceler mesajı", topic: "Günün kapanışında huzurlu iyi geceler mesajı; bir küçük içgörü ve CTA; 1–2 hashtag.", tone: "plain" },
      { label: "Base ipucu", topic: "Base ağı için yeni başlayanlara 1 pratik ipucu; tek paragraf; küçük CTA; 1–2 hashtag.", tone: "professional" },
    ],
    image: {
      label: "Görsel (JPG/PNG kabul edilir)",
      drop: "Buraya tıkla veya görseli sürükleyip bırak\nya da aşağıdan üret",
      genBtn: "Görsel Üret",
      clear: "Temizle",
      close: "Kapat",
      loading: "Yükleniyor…",
      promptPH: "Görsel üretmek için bir istem yaz",
      tip: 'İpucu: Kısa ve net yaz. Örn: "minimal blue gradient background with crypto icons".',
    },
  },
  en: {
    subtitle: "Enter a topic → 1 paragraph + image → Share.",
    labels: {
      topic: "Topic",
      tone: "Tone",
      style: "Style",
      generate: "Generate Text + Image",
      regenerate: "Regenerate",
      share: "Share",
      topicPH: "What's today's topic? (e.g., a quick Base tip)",
    },
    tones: { plain: "plain", witty: "witty", professional: "professional" },
    styles: { "photo-realistic": "photo-realistic", illustration: "illustration", "3D": "3D", minimal: "minimal" },
    presets: [
      { label: "Daily crypto recap", topic: "A concise daily crypto market recap: 3 headlines + tiny commentary; end with one-sentence CTA and 1–2 hashtags.", tone: "professional" },
      { label: "Quote of the day", topic: "Short, inspiring quote for crypto/tech culture; one paragraph comment and a tiny CTA; 1–2 hashtags.", tone: "plain" },
      { label: "Good morning", topic: "Positive good-morning note for the crypto community; a tiny daily goal and CTA; 1–2 hashtags.", tone: "witty" },
      { label: "Good night", topic: "Calm good-night note to close the day; one small insight and CTA; 1–2 hashtags.", tone: "plain" },
      { label: "Base tip", topic: "One practical tip for beginners on Base; single paragraph; small CTA; 1–2 hashtags.", tone: "professional" },
    ],
    image: {
      label: "Image (Accepts JPG/PNG)",
      drop: "Click or drag to upload an image here\nor generate one below",
      genBtn: "Generate Image",
      clear: "Clear",
      close: "Close",
      loading: "Loading…",
      promptPH: "Type a prompt to generate an image",
      tip: 'Tip: Keep it short and clear. e.g., "minimal blue gradient background with crypto icons".',
    },
  },
} as const;
