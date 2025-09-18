'use client';
import { useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { UI } from '@/lib/i18n';

type Props = {
  value?: string;
  onChange: (url: string) => void;
  lang?: Lang; // "tr" | "en"
};

export default function ImagePicker({ value, onChange, lang = "en" }: Props) {
  const t = UI[lang].image;
  const [openGen, setOpenGen] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (res.ok && j.url) onChange(j.url);
    else alert(j.error || 'Upload failed');
  }

  async function generate() {
    if (!genPrompt.trim()) return;
    setLoading(true);
    setCandidates([]);
    const res = await fetch('/api/image/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: genPrompt })
    });
    const j = await res.json();
    setCandidates(j.images || []);
    setLoading(false);
  }

  return (
    <div className="border-2 border-violet-300 rounded-2xl p-4 bg-white shadow-sm">
      <label className="block text-xs font-medium text-zinc-600 mb-2">
        {t.label}
      </label>

      <div
        className="w-full bg-white border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer
                   border-violet-300 hover:border-violet-400 transition"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Selected" className="mx-auto max-h-48 rounded-md" />
        ) : (
          <div className="text-zinc-500 whitespace-pre-line">{t.drop}</div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      <div className="text-center mt-3">
        <button
          onClick={() => setOpenGen(true)}
          className="px-3 py-2 rounded-xl border-2 border-violet-400 hover:border-violet-500
                     bg-white text-violet-700 font-medium"
        >
          {t.genBtn}
        </button>
        {value && (
          <button onClick={() => onChange('')} className="ml-2 px-3 py-2 rounded-xl bg-zinc-100 text-zinc-700">
            {t.clear}
          </button>
        )}
      </div>

      {openGen && (
        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="flex gap-2">
            <input
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder={t.promptPH}
              className="flex-1 border-2 rounded-xl bg-white border-violet-300 focus:border-violet-500
                         focus:ring-4 focus:ring-violet-200 px-3 py-2 text-black placeholder-zinc-400"
            />
            <button onClick={generate} disabled={loading}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500
                               text-white font-semibold disabled:opacity-60">
              {loading ? t.loading : t.genBtn}
            </button>
            <button onClick={() => setOpenGen(false)} className="px-3 py-2 rounded-xl bg-zinc-100 text-zinc-700">
              {t.close}
            </button>
          </div>

          {!!candidates.length && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {candidates.map((u) => (
                <button key={u}
                        onClick={() => { onChange(u); setOpenGen(false); }}
                        className="border-2 border-violet-200 hover:border-violet-400 rounded-xl overflow-hidden"
                        title="Use this image">
                  <img src={u} alt="candidate" className="w-full h-36 object-cover" />
                </button>
              ))}
            </div>
          )}
          {!candidates.length && !loading && (
            <p className="text-xs text-zinc-500 mt-2">{t.tip}</p>
          )}
        </div>
      )}
    </div>
  );
}
