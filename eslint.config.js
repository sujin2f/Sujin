import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
    {
        ...react.configs.flat.recommended,
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
    {
        plugins: {
            'react-hooks': hooksPlugin,
        },
        rules: hooksPlugin.configs.recommended.rules,
    },
    {
        ...jsxA11y.flatConfigs.recommended,
        rules: {
            ...jsxA11y.flatConfigs.recommended.rules,
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-noninteractive-element-interactions': 'off',
        },
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
)
