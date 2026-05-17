import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Standalone demo / component gallery. Renders every kit export across all
 * four palettes — the canonical visual reference for catching drift before a
 * release. Not part of the published package (`files` in package.json).
 *
 *   npm run demo         dev server
 *   npm run demo:build   static build to demo/dist
 *
 * Components are imported straight from `src/` (not the built `dist/`), so the
 * gallery always reflects the working tree. The `@` alias resolves the kit's
 * internal `@/…` imports; Tailwind processes `theme.css` + scans `src/`.
 */
export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
})
