import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Límite de 20MB para archivos grandes
    },
  },
};

export default nextConfig;
