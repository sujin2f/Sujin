const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const commonPaths = require('./paths')
const { createWebpackAliases } = require('./helpers')

module.exports = {
    entry: commonPaths.entryPath,
    module: {
        rules: [
            {
                // Typescript loader
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
            {
                // CSS Loader
                test: /\.css$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            },
            {
                // SCSS (SASS) Loader
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: { api: 'modern' },
                    },
                ],
            },
            {
                // Less loader
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
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
            src: 'src',
        }),
    },
    plugins: [
        new WebpackManifestPlugin({
            publicPath: '',
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            fix: true,
            emitWarning: process.env.NODE_ENV !== 'production',
        }),
    ],
    devtool: 'source-map',
}
