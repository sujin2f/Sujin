import * as path from 'path'
import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'
const { EnvironmentPlugin } = webpack
import packageJson from './package.json' with { type: 'json' };

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
        port: 4000,
        hot: true, // Enable Hot Module Replacement
    }
}

export default config
