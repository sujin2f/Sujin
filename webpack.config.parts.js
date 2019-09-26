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
import cssnano from 'cssnano';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

exports.setBase = function(entry, dist) {
  const dev = 'start' === process.env.npm_lifecycle_event;
  const production = 'build' === process.env.npm_lifecycle_event;
  const productionSetting = {};
  const clean = Object.keys(entry)
    .filter(key => entry[key].endsWith('.scss'))
    .reduce((value, key) => {
      const filename = entry[key].split('/').pop();
      return [
        ...value,
        path.resolve(dist, filename.replace('.scss', '.js')),
        path.resolve(dist, filename.replace('.scss', '.js.map')),
      ];
    }, []);

  const plugins = [
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CompressionPlugin({
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8,
    }),
    new WebpackCleanPlugin(clean),
    new MiniCssExtractPlugin(),
  ];
  if (!production && !dev) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? false : 'inline-source-map',
    cache: production ? true : false,
    output: {
      path: dist,
      filename: '[name].js',
      publicPath: '/wp-content/themes/sujin/',
    },
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
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    plugins,
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
      },
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
