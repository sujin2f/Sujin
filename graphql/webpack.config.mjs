import * as path from 'path'
import nodeExternals from 'webpack-node-externals'

export default {
    target: 'node',
    entry: './src/server.ts',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@src': path.resolve(import.meta.dirname, 'src'),
            '@common': path.resolve(import.meta.dirname, '..', 'common'),
            '@lib': path.resolve(import.meta.dirname, '..', 'lib'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(import.meta.dirname, '.build'),
    },
    optimization: {
        minimize: false, // Disables minification
    },
    devServer: {
        compress: true,
        port: 4000,
        hot: true, // Enable Hot Module Replacement
    },
}
