import type { NextConfig } from "next"

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2PublicBaseUrl
      ? [new URL(`${r2PublicBaseUrl.replace(/\/$/, "")}/**`)]
      : [],
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // The TypeScript CLI truncates `--showConfig` output under the local Node 24
    // runtime. The compiler API is the supported fallback for TypeScript 5.x.
    useTypeScriptCli: false,
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
