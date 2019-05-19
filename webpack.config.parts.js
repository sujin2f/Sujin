/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackCleanPlugin from 'webpack-clean';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import cssnano from 'cssnano';

exports.setBase = function(entry, dist) {
  const production = 'build' === process.env.npm_lifecycle_event;
  const productionSetting = {};
  const clean = Object.keys(entry)
    .filter(key => entry[key].endsWith('.scss'))
    .reduce((value, key) => {
      const filename = entry[key].split('/').pop();
      return [
        ...value,
        `dist/${filename.replace('.scss', '.js')}`,
        `dist/${filename.replace('.scss', '.js.map')}`,
      ];
    }, []);

  return {
    mode: production ? 'production' : 'development',
    devtool: production ? false : 'source-map',
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
      new CompressionPlugin({
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          threshold: 10240,
          minRatio: 0.8,
      }),
      new WebpackCleanPlugin(clean),
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin(),
        new OptimizeCSSAssetsPlugin(),
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
