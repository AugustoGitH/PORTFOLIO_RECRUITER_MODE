import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// Single source of truth for the backend port: read PORT from backend/.env so
// the dev proxy always matches the port the backend actually listens on.
// Falls back to 3000 if the file or key is missing.
function backendPort(): number {
  try {
    const env = readFileSync(
      fileURLToPath(new URL('../backend/.env', import.meta.url)),
      'utf8'
    )
    const match = env.match(/^\s*PORT\s*=\s*(\d+)/m)
    if (match) return Number(match[1])
  } catch {
    // no .env yet — use the default below
  }
  return 3000
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
     tailwindcss(),
  ],
  // In dev, forward API calls to the Fastify backend so the frontend can talk
  // to it without CORS. In production the backend serves the built frontend.
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': `http://localhost:${backendPort()}`,
    },
  },
})
