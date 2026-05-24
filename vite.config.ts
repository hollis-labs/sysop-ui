import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

/**
 * Library build. Emits an ES module + `.d.ts` declarations to `dist/`.
 * Modules are preserved so consumers tree-shake at the component level.
 * React, its runtime, and every dependency stay external — the consuming
 * app installs them. CSS ships raw (see `exports["./theme.css"]`).
 */
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/__tests__'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        ui: path.resolve(__dirname, 'src/ui.ts'),
        api: path.resolve(__dirname, 'src/api.ts'),
        layout: path.resolve(__dirname, 'src/layout.ts'),
        data: path.resolve(__dirname, 'src/data.ts'),
        widgets: path.resolve(__dirname, 'src/widgets.ts'),
        charts: path.resolve(__dirname, 'src/charts.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/') ||
        id.startsWith('@base-ui/') ||
        id === 'recharts' ||
        id.startsWith('recharts/') ||
        ['clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react', 'cmdk', 'sonner'].includes(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
