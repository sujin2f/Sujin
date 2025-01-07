import { outputPath } from './paths.js'

export default {
    mode: 'development',
    output: {
        filename: '[name].js',
        path: outputPath,
        chunkFilename: '[name].js',
    },
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
        ],
    },
    devServer: {
        contentBase: outputPath,
        compress: true,
        hot: true,
    },
}
