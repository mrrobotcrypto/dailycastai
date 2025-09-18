// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Lint hataları build’i durdurmasın
  },
  typescript: {
    ignoreBuildErrors: true, // TS hataları build’i durdurmasın
  },
  experimental: {
    appDir: true, // App Router açık
  },
  images: {
    unoptimized: true, // Vercel’de optimize etme zorunluluğunu kapat
  },
};

export default nextConfig;
