// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint hataları build’i durdurmasın
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hataları build’i durdurmasın
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true,   // 🔑 App Router aktif
  },
};


export default nextConfig;
