/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackCleanPlugin from 'webpack-clean';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';

exports.setBase = function(dist) {
  const production = 'build' === process.env.npm_lifecycle_event;
  let productionSetting = {};

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? false : 'inline-source-map',
    cache: production ? true : false,
    output: {
      path: dist,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'eslint-loader',
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                disable: true, // webpack@2.x and newer
              },
            },
          ],
        }
      ],
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new ExtractTextPlugin('[name].css'),
      new WebpackCleanPlugin(
        ['style.js'],
        { basePath: dist }
      ),
      new CompressionPlugin({
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
          // Run cssnano in safe mode to avoid
          // potentially unsafe transformations.
          safe: true,
        },
        canPrint: false,
      }),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin()
      ],
    },
    // Prevent conflicts
    externals: {
      lodash: 'lodash',
    },
  };
};

exports.setResolve = function(resolvePath = {}) {
  const alias = {
    app: path.resolve(__dirname, 'app'),
    ...resolvePath,
  };

  return {
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias,
    },
  };
};
