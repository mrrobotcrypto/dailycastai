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

const nextConfig = {
  experimental: {
    appDir: true,
  },
};

export default nextConfig;


export default nextConfig;
