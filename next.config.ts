import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
