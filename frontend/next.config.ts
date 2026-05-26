import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["@monaco-editor/react"],
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
      config.parallelism = 1;
    }
    return config;
  },
};

export default nextConfig;
