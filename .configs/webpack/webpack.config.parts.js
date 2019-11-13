/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackCleanPlugin from 'webpack-clean';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';

export const setEntry = (entry) => {
  return { entry };
};

export const setBase = (entry, dist, wpThemePath) => {
  const garbage = Object.keys(entry)
    .filter(key => entry[key].endsWith('.scss'))
    .reduce((value, key) => {
      const filename = entry[key].split('/').pop();
      return [
        ...value,
        path.resolve(dist, filename.replace('.scss', '.js')),
        path.resolve(dist, filename.replace('.scss', '.js.map')),
      ];
    }, []);

  return {
    mode: isProduction() ? 'production' : 'development',
    devtool: isProduction() ? false : 'inline-source-map',
    cache: isProduction() ? true : false,
    /*
     * Prevent Conflict from Gutenberg
     */
    externals: {
      lodash: 'lodash',
    },
    output: {
      path: dist,
      filename: '[name].[hash].js',
      publicPath: wpThemePath,
    },
    plugins: [
      /*
       * Clean destination before build
       */
      new CleanWebpackPlugin(),
      /*
       * Clean .js from .sass fater build
       */
      new WebpackCleanPlugin(garbage),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new ManifestPlugin(),
      new CompressionPlugin({
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
      }),
    ],
    optimization: {
      splitChunks: { chunks: 'all' },
    },
  };
};

export const setJS = () => {
  return {
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          enforce: 'pre',
          use: [
            {
              loader: 'babel-loader',
              query: {
                compact: false,
              },
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
        {
          test: /\.ts(x?)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'eslint-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
      ],
    },
  };
};

export const setCSS = () => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [require('autoprefixer')],
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(),
      ],
    },
  };
};

export const setFiles = (wpThemePath) => {
  return {
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'images',
            publicPath: `${wpThemePath}/images/`,
          },
        },
      ],
    },
  };
};

export const setAnalyzer = () => {
  if (isProduction() || isDev()) {
    return {};
  }

  return {
    plugins: [
      new BundleAnalyzerPlugin(),
    ],
  };
};

export const setResolve = (resolvePath) => {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: { ...resolvePath },
    },
  };
};

const isProduction = () => 'build' === process.env.npm_lifecycle_event;
const isDev = () => 'start' === process.env.npm_lifecycle_event;
