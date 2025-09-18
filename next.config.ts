// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Build sırasında ESLint hatalarını yoksay
  },
  typescript: {
    ignoreBuildErrors: true, // TS hatalarını yoksay
  },
  experimental: {
    appDir: true, // App Router açık
  },
  images: {
    unoptimized: true, // Vercel’de optimize etme zorunluluğunu kapat
  },
};

export default nextConfig;
