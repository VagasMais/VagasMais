import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // Prevent legacy .jsx files from being added going forward
  {
    files: ['**/*.jsx'],
    rules: {
      // If any .jsx file exists, fail lint with a clear message.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: 'Usage of .jsx files is not allowed. Convert to .tsx and use TypeScript types.',
        },
      ],
    },
  },
])
