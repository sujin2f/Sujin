import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
    compress: false,
    webpack(config) {
        // SVG loader
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: {
                    not: [...fileLoaderRule.resourceQuery.not, /url/],
                },
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
        )

        fileLoaderRule.exclude = /\.svg$/i

        return config
    },
    turbopack: {
        rules: {
            '*.txt': {
                loaders: ['raw-loader'],
                as: '*.js',
            },
            '*.graphql': {
                loaders: ['graphql-tag/loader'],
                as: '*.txt',
            },
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                    },
                ],
                as: '*.js',
            },
        },
        resolveExtensions: ['.graphql', '.gql', '.txt', '.js', '.jsx', '.ts', '.tsx'],
    },
}

export default nextConfig
