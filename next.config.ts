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
};

export default nextConfig;
