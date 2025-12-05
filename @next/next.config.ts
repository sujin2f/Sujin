import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
    turbopack: {
        resolveExtensions: ['.graphql', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
        rules: {
            '*.graphql': {
                loaders: ['graphql-tag/loader'],
                as: '*.js',
            },
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
}

export default nextConfig
