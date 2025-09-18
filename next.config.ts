// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true,   // 🔑 App Router açık
  },
};

const nextConfig = {
  images: {
    unoptimized: true, // Vercel’de optimize etme zorunluluğunu kapat
  },
};

export default nextConfig;
