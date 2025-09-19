'use client';
import { useEffect, useRef, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import ImagePicker from '@/components/ImagePicker';
import Logo from '@/components/Logo';
import { UI, type Lang } from '@/lib/i18n';

type Me = {
  session: {
    fid: number;
    username?: string;
    display_address?: string;
  } | null;
};

// ===== WALLET UI =====
function ConnectWallet() {
  const [me, setMe] = useState<Me["session"]>(null);
  const [open, setOpen] = useState(false); // modal

  async function refreshMe() {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      const j: Me = await r.json();
      setMe(j.session);
    } catch {}
  }

  useEffect(() => {
    refreshMe();
    // Neynar dönüşünde ?signedIn=1 varsa temizle & me çek
    if (typeof window !== "undefined" && window.location.search.includes("signedIn=1")) {
      const u = new URL(window.location.href);
      u.searchParams.delete("signedIn");
      window.history.replaceState({}, "", u.toString());
    }
  }, []);

  async function startSiwn() {
    const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
    const r = await fetch(`/api/siwn/start?returnTo=${encodeURIComponent(returnTo)}`);
    const j = await r.json();
    if (j.url) window.location.assign(j.url);
    else alert(j.error || "Unable to start SIWN");
  }

  async function disconnect() {
    await fetch("/api/logout", { method: "POST" });
    setMe(null);
    setOpen(false);
  }

  // Sağ üstteki buton
  return (
    <div className="flex justify-end mb-4">
      {/* Bağlıysa kısaltılmış adres + menü */}
      {me ? (
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-violet-300 bg-white px-3 py-2 text-violet-700"
          >
            <span className="hidden sm:inline">Wallet Connected</span>
            <span className="font-mono">{me.display_address || me.username || `fid:${me.fid}`}</span>
            <span className="text-violet-500">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-violet-200 bg-white shadow-lg p-3 z-20">
              <div className="text-sm text-zinc-600">Connected with Farcaster</div>
              <div className="mt-1 font-mono text-zinc-800">
                {me.display_address || me.username || `fid:${me.fid}`}
              </div>
              <button
                onClick={disconnect}
                className="mt-3 w-full rounded-lg bg-red-600 hover:bg-red-700 text-white py-2 font-semibold"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      ) : (
        // Bağlı değilse: Connect Wallet butonu (modal açar)
        <div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-white font-semibold"
          >
            Connect Wallet
          </button>

          {open && (
            <div className="fixed inset-0 z-30 grid place-items-center bg-black/40">
              <div className="w-[90%] max-w-md rounded-2xl bg-white p-5">
                <div className="text-lg font-semibold mb-3">Connect Your Wallet</div>
                <p className="text-sm text-zinc-600 mb-4">
                  Choose a wallet to connect and access the platform
                </p>
                <div
                  onClick={startSiwn}
                  className="cursor-pointer rounded-xl border-2 border-violet-300 p-4 mb-3 hover:border-violet-500"
                >
                  <div className="font-semibold">Farcaster</div>
                  <div className="text-sm text-zinc-600">Connect wallet</div>
                </div>

                <div
                  onClick={() => alert("Coinbase Wallet entegrasyonu yakında.")}
                  className="cursor-pointer rounded-xl border-2 border-violet-300 p-4 hover:border-violet-500"
                >
                  <div className="font-semibold">Coinbase Wallet</div>
                  <div className="text-sm text-zinc-600">Connect using Coinbase Wallet</div>
                </div>

                <button
                  className="mt-4 w-full rounded-xl border border-zinc-300 py-2"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ===== SAYFA =====

const TONES = ["plain", "witty", "professional"] as const;
const STYLES = ["photo-realistic", "illustration", "3D", "minimal"] as const;

export default function Home() {
  useEffect(() => { (async () => { try { await sdk.actions.ready(); } catch {} })(); }, []);

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

  const topicRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setTopic("");
    setTone("plain");
    setStyle("illustration");
    setImageUrl("");
    setText("");
    setError("");
    setTimeout(() => topicRef.current?.focus(), 0);
  }
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
      {/* Wallet bölümü */}
      <ConnectWallet />

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
              {["plain","witty","professional"].map((x)=> <option key={x} value={x}>{UI[lang].tones[x as any]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 mb-1">{t.labels.style}</label>
            <select
              className="w-full border-2 border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-200
                         rounded-xl px-3 py-2 bg-white text-black"
              value={style} onChange={e=>setStyle(e.target.value as any)}
            >
              {["photo-realistic","illustration","3D","minimal"].map((x)=> <option key={x} value={x}>{UI[lang].styles[x as any]}</option>)}
            </select>
          </div>
        </div>

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

      <footer className="mt-10 pb-4 text-center text-xs text-zinc-500">
        <span>&copy; {new Date().getFullYear()} MrRobotCrypto</span>
        <span className="mx-2">•</span>
        <span>v1</span>
      </footer>
    </main>
  );
}
