import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // La configuración de eslint se maneja por separado en esta versión o se omite para evitar advertencias
};

export default nextConfig;
