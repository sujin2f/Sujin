import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        env: {
            node: true,
            es2021: true,
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
    },
)
