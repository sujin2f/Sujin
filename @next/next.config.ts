import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    /* config options here */
    webpack(config) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileLoaderRule = config.module.rules.find((rule: any) =>
            rule.test?.test?.('.svg'),
        )

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
        )

        fileLoaderRule.exclude = /\.svg$/i

        return config
    },
    typescript: {
        tsconfigPath: 'tsconfig.webpack.json',
    },
}

export default nextConfig
