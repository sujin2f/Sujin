import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import globals from 'globals'

// TODO Apply
export default defineConfig(eslint.configs.recommended, tseslint.configs.recommended, {
    languageOptions: {
        globals: {
            ...globals.es2021,
            ...globals.node,
        },
    },
    rules: {
        'no-console': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '_',
            },
        ],
    },
})
