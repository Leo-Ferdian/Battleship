import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/engine/**/*.ts'],
      exclude: ['src/engine/**/*.test.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 85,
      },
    },
  },
})
