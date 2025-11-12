import * as path from 'path'
import nodeExternals from 'webpack-node-externals'

const config = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    target: 'node',
    entry: './src/server.ts',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.webpack.json',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@src': path.resolve(import.meta.dirname, 'src'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(import.meta.dirname, '.build'),
    },
    optimization: {
        minimize: process.env.NODE_ENV !== 'development', // Disables minification
    },
}

if (process.env.NODE_ENV === 'development') {
    config.devServer = {
        compress: true,
        port: 4000,
        hot: true, // Enable Hot Module Replacement
    }
}

export default config
