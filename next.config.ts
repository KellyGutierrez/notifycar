import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: `v${new Date().getDate().toString().padStart(2, '0')}.${(new Date().getMonth() + 1).toString().padStart(2, '0')}.${new Date().getFullYear().toString().slice(-2)}`,
  },
};

export default nextConfig;
