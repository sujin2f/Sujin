import * as path from 'path'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
const { EnvironmentPlugin } = webpack
import packageJson from './package.json' with { type: 'json' }

const config = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    target: 'node',
    entry: {
        bundle: './src/server.ts',
        subscriber: './src/utils/redis/subscriber.ts',
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@src': path.resolve(import.meta.dirname, 'src'),
            '@common': path.resolve(import.meta.dirname, 'common', 'src'),
        },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(import.meta.dirname, '.build'),
    },
    optimization: {
        minimize: process.env.NODE_ENV !== 'development', // Disables minification
    },
    plugins: [
        // These will be converted a value. i.g. if (...IS_BETA === true) => if (true === true)
        new EnvironmentPlugin({
            VERSION: packageJson.version,
            IS_BETA: packageJson.version.includes('beta'),
        }),
    ],
}

if (process.env.NODE_ENV === 'development') {
    config.devServer = {
        compress: true,
        watchFiles: ['src/**/*', 'common/**/*'],

        port: 4000,
        hot: true, // Enable Hot Module Replacement
    }
}

export default config
