import type { NextConfig } from 'next'
import webpack from 'webpack'
const { EnvironmentPlugin } = webpack
import packageJson from './package.json'

const nextConfig: NextConfig = {
    output: 'standalone',
    /* config options here */
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

        // env var
        config.plugins.push(
            new EnvironmentPlugin({
                VERSION: packageJson.version,
                IS_BETA: packageJson.version.includes('beta'),
            }),
        )

        return config
    },
    typescript: {
        tsconfigPath: 'tsconfig.json', // TODO Production
    },
}

export default nextConfig
