import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@backend": path.resolve(import.meta.dirname, "backend"),
      "server-only": path.resolve(import.meta.dirname, "tests/mocks/server-only.ts"),
      "next/cache": path.resolve(import.meta.dirname, "tests/mocks/next-cache.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "backend/**/*.test.ts"],
    clearMocks: true,
  },
})
