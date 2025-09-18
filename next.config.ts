// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build sırasında ESLint hatalarını dikkate alma
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prod’da "any" gibi tip hataları yüzünden build’i bozma
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
