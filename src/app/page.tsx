'use client';
import { useEffect, useRef, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import ImagePicker from '@/components/ImagePicker';
import Logo from '@/components/Logo';
import { UI, type Lang } from '@/lib/i18n';

const TONES = ["plain", "witty", "professional"] as const;
const STYLES = ["photo-realistic", "illustration", "3D", "minimal"] as const;

export default function Mini() {
  // Farcaster splash kapat
  useEffect(() => { (async () => { try { await sdk.actions.ready(); } catch {} })(); }, []);

  // Dil (localStorage ile kalıcı)
  const [lang, setLang] = useState<Lang>("tr");
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('dcai_lang') as Lang | null) : null;
    if (stored) setLang(stored);
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('dcai_lang', lang);
  }, [lang]);

  const t = UI[lang];
  const presets = t.presets;

  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<typeof TONES[number]>("plain");
  const [style, setStyle] = useState<typeof STYLES[number]>("illustration");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // inputa odak için ref
  const topicRef = useRef<HTMLInputElement>(null);

  // tek noktadan reset
  function resetForm() {
    setTopic("");
    setTone("plain");
    setStyle("illustration");
    setImageUrl("");
    setText("");
    setError("");
    // küçük bir tik ile odak
    setTimeout(() => topicRef.current?.focus(), 0);
  }

  // DİL DEĞİŞİNCE HER ŞEY SIFIRLANSIN
  useEffect(() => { resetForm(); }, [lang]);

  function applyPreset(p: {label: string; topic: string; tone?: typeof TONES[number]}) {
    setTopic(p.topic);
    if (p.tone) setTone(p.tone);
  }

  async function generate() {
    setLoading(true); setError("");
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, style, skipImage: !!imageUrl, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation error');
      setText(data.text || '');
      if (!imageUrl && data.imageUrl) setImageUrl(data.imageUrl);
    } catch (e:any) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function share() {
    if (!text) return;
    const res = await fetch('/api/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, imageUrl })
    });
    const j = await res.json();
    if (!res.ok) { alert(j.error || 'Failed to post cast'); return; }
    alert('Cast posted!');
  }

  return (
    <main className="mx-auto max-w-[720px] p-6">
      {/* Dil seçici + başlık */}
      <header className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="inline-flex rounded-xl overflow-hidden border-2 border-violet-300">
            <button
              onClick={() => setLang('tr')}
              className={`px-4 py-1.5 ${lang==='tr' ? 'bg-violet-600 text-white' : 'bg-white text-violet-700'}`}
            >TR</button>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 ${lang==='en' ? 'bg-violet-600 text-white' : 'bg-white text-violet-700'}`}
            >EN</button>
          </div>
        </div>
        <Logo />
        <p className="text-zinc-500 mt-2">{t.subtitle}</p>
      </header>

      {/* Presetler */}
      <section className="mb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-full border-2 border-violet-300 hover:border-violet-500
                         bg-white text-violet-700 text-xs font-medium transition"
              title={p.topic}>
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1">{t.labels.topic}</label>
          <input
            ref={topicRef}
            className="w-full border-2 border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-200
                       rounded-xl px-4 py-3 bg-white text-black placeholder-zinc-400 shadow-sm"
            placeholder={t.labels.topicPH}
            value={topic} onChange={(e)=>setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">{t.labels.tone}</label>
            <select
              className="w-full border-2 border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-200
                         rounded-xl px-3 py-2 bg-white text-black"
              value={tone} onChange={e=>setTone(e.target.value as any)}
            >
              {TONES.map((x)=> <option key={x} value={x}>{UI[lang].tones[x]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">{t.labels.style}</label>
            <select
              className="w-full border-2 border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-200
                         rounded-xl px-3 py-2 bg-white text-black"
              value={style} onChange={e=>setStyle(e.target.value as any)}
            >
              {STYLES.map((x)=> <option key={x} value={x}>{UI[lang].styles[x]}</option>)}
            </select>
          </div>
        </div>

        {/* DİKKAT: lang değişince iç state de sıfırlansın diye key veriyoruz */}
        <ImagePicker key={lang} value={imageUrl} onChange={setImageUrl} lang={lang} />

        <button onClick={generate} disabled={loading || !topic}
          className="w-full mt-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500
                     text-white py-3 font-semibold shadow-sm disabled:opacity-60">
          {loading ? '…' : t.labels.generate}
        </button>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        {(text || imageUrl) && (
          <div className="mt-5 space-y-3">
            {imageUrl && <img src={imageUrl} alt="Selected" className="w-full rounded-xl border-2 border-violet-200" />}
            {text && (
              <div className="rounded-xl border-2 border-violet-200 bg-white p-4">
                <p className="leading-relaxed whitespace-pre-wrap text-black">{text}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={generate}
                className="flex-1 rounded-xl border-2 border-violet-400 bg-white text-violet-700 py-2 font-medium">
                {t.labels.regenerate}
              </button>
              <button onClick={share}
                className="flex-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white py-2 font-semibold">
                {t.labels.share}
              </button>
            </div>
          </div>
        )}
      </section>

{/* Footer */}
<footer className="mt-10 pb-4 text-center text-xs text-zinc-500">
  <span>&copy; {new Date().getFullYear()} MrRobotCrypto</span>
  <span className="mx-2">•</span>
  <span>v1</span>
</footer>


    </main>
  );
}
