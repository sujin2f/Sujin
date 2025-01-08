import ESLintPlugin from 'eslint-webpack-plugin'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import { entryPath } from './paths.js'
import { createWebpackAliases } from './helpers.js'

export default {
    entry: entryPath,
    module: {
        rules: [
            {
                // Assets loader
                // More information here https://webpack.js.org/guides/asset-modules/
                test: /\.(gif|jpe?g|tiff|png|webp|bmp|eot|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[hash][ext][query]',
                },
            },
            {
                test: /\.svg$/,
                issuer: /\.s[ac]ss$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[hash][ext][query]',
                },
            },
            {
                test: /\.svg$/,
                issuer: /\.tsx?$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
        alias: createWebpackAliases({
            '@src': 'src',
        }),
    },
    plugins: [
        new WebpackManifestPlugin({
            publicPath: '',
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            fix: true,
            configType: 'flat',
        }),
    ],

    devtool: 'source-map',
}
