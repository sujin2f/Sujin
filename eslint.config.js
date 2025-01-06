import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ...react.configs.flat.recommended,
        files: ['**/*.{ts,tsx,mtsx}'],
        rules: {
            ...react.configs.flat.recommended.rules,
            'react/jsx-filename-extension': [
                1,
                { extensions: ['.jsx', '.tsx'] },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    jsxA11y.flatConfigs.recommended,
    eslint.configs.recommended,
    tseslint.configs.recommended,
)
