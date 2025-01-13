import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config({
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        react.configs.flat.recommended,
        jsxA11y.flatConfigs.recommended,
        'next/core-web-vitals',
        'next/typescript',
    ],
    plugins: {
        'react-hooks': hooksPlugin,
    },
    rules: {
        ...hooksPlugin.configs.recommended.rules,
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        '@typescript-eslint/no-duplicate-enum-values': 'off',
    },
})
