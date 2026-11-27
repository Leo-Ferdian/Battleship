import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Engine harus murni (lihat docs/TECH_SPEC.md bagian 3)
    files: ['src/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react/*',
                'react-dom',
                'react-dom/*',
                'zustand',
                'zustand/*',
                'i18next',
                'react-i18next',
              ],
              message:
                'Engine tidak boleh bergantung pada React, Zustand, atau i18n.',
            },
            {
              group: [
                '**/store/**',
                '**/features/**',
                '**/components/**',
                '**/animation/**',
                '**/i18n/**',
                '**/styles/**',
              ],
              message: 'Engine tidak boleh mengimpor lapisan di atasnya.',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
        'navigator',
        'setTimeout',
        'setInterval',
        'requestAnimationFrame',
        'performance',
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Pakai Rng yang disuntikkan.',
        },
        {
          object: 'Date',
          property: 'now',
          message: 'Engine tidak boleh membaca waktu global.',
        },
      ],
    },
  },
])
