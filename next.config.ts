import type { NextConfig } from "next"

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim()
const legacyR2PublicBaseUrl = "https://pub-0e7d4473a3bd416f9163cd308a2daed6.r2.dev"

const r2ImagePatterns = [r2PublicBaseUrl, legacyR2PublicBaseUrl]
  .filter((url): url is string => Boolean(url))
  .map((url) => new URL(`${url.replace(/\/$/, "")}/**`))

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2ImagePatterns,
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
