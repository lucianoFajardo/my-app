import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    //** Ignorar errores de ESLint durante la construcción, tener en cuenta que esto puede ocultar problemas de código ....  */
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
