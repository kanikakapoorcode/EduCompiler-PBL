import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@monaco-editor/react"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Lower memory pressure on Windows (avoids Array buffer allocation failed / Gunzip OOM)
      config.parallelism = 1;
      config.cache = false;
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
