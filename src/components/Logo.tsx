'use client';

type Props = { size?: number };

export default function Logo({ size = 36 }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="dcai" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        {/* Dönen kıvılcım/cast izi */}
        <path
          d="M8 42c8 1 14-3 20-9s12-11 22-10"
          stroke="url(#dcai)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Yıldız */}
        <path
          d="M44 14l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"
          fill="url(#dcai)"
        />
      </svg>
      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
        DailyCast AI
      </span>
    </div>
  );
}
