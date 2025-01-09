import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import path from 'path'
import { config as dotEnvConfig } from 'dotenv'

import { outputPath } from './paths.js'

const rootDir = process.cwd()
dotEnvConfig({ path: path.resolve(rootDir, '.env') })

if (!process.env.VERSION) {
    throw Error('Please add VERSION to your .env file')
}

export default {
    mode: 'production',
    output: {
        publicPath: `/${process.env.VERSION}/`,
        filename: '[name].js',
        path: `${outputPath}/${process.env.VERSION}`,
        chunkFilename: '[name].[chunkhash].js',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
        splitChunks: {
            chunks: 'all',

            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'initial',
                },
                async: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'async',
                    chunks: 'async',
                    minChunks: 4,
                },
            },
        },
        runtimeChunk: 'single',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: /\.(css|scss)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name][hash].css',
        }),
    ],
}
