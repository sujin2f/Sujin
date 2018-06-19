/* eslint-disable */
import path from 'path';
import webpack from 'webpack';
import config from 'config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CompressionPlugin from 'compression-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const dev = process.env.NODE_ENV !== "production";

exports.setupBase = function() {
  return {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'inline-source-map' : 'none',
    cache: !dev,
    output: {
      path: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
      filename: '[name].[hash].js',
      chunkFilename: '[id].js',
      publicPath: '/',
    },
    plugins: [
      new CleanWebpackPlugin(
        path.resolve(__dirname, '../', process.env.npm_package_config_paths_output),
        {
          root: path.resolve(__dirname, '../'),
        }
      ),
      new webpack.EnvironmentPlugin({
        NODE_ENV: dev ? 'development' : 'production',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'SUJIN_BASE_URL': config.has('process.env.SUJIN_BASE_URL')
            ? JSON.stringify(config.get('process.env.SUJIN_BASE_URL'))
            : JSON.stringify(""),
          'SUJIN_AJAX_URL': config.has('process.env.SUJIN_AJAX_URL')
            ? JSON.stringify(config.get('process.env.SUJIN_AJAX_URL'))
            : JSON.stringify(""),
        }
      }),
      new WebpackAssetsManifest({
        writeToDisk: true,
        sortManifest: false
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  }
};

exports.setupMinimize = function() {
  return {
    plugins: [
      new CompressionPlugin({
          asset: '[path].gz[query]',
          minify: true,
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
          threshold: 10240,
          minRatio: 0.8
      }),
    ],
    optimization: {
      minimizer: [
        // we specify a custom UglifyJsPlugin here to get source maps in production
        new UglifyJsPlugin({
          cache: !dev,
          parallel: true,
          uglifyOptions: {
            compress: true,
            ecma: 6,
            mangle: true
          },
          sourceMap: dev
        })
      ],
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          commons: {
            name: "vendor",
            chunks: "initial",
            minChunks: Infinity
          }
        }
      }
    }
  };
};

exports.setupFriendlyErrors = function() {
  return {
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
    ],
  }
};

exports.setupNoEmit = function() {
  return {
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }
};

exports.setupLoaderOptions = function() {
  return {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: dev,
      }),
    ],
  }
};

exports.setupHotReplace = function() {
  return {
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  }
};

exports.setupEntries = function(paths) {
  let entry = { ...paths };

  if (dev) {
    entry = {
      ...entry,
      hot: 'webpack/hot/only-dev-server',
      dev: 'webpack-dev-server/client?http://localhost:8080',
    };
  } else {
    entry = {
      ...entry,
      vendor: ['react', 'react-router', 'redux', 'react-redux', 'react-dom', 'react-router-redux', 'redux-form'],
    };
  }
  return {
    entry,
  }
};

exports.setupResolves = function(paths) {
  return {
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: paths,
    },
  }
};

exports.setupLint = function(include) {
  return {
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          enforce: "pre",
          use: [{
            loader: 'eslint-loader',
          }],
          include,
        },
      ]
    },
  }
};

exports.setupBabel = function(include) {
  return {
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }],
          include,
        }
      ]
    },
  }
};

exports.setupDevServer = function(options) {
  return {
    devServer: {
      contentBase: options.contentBase || false,

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      //host: options.host || '0.0.0.0', // Defaults to `localhost`
      port: options.port, // Defaults to 8080
      proxy: options.proxy,
      headers: options.headers,
      disableHostCheck: options.disableHostCheck
    },
  };
};

// Template
exports.setupTemplate = function (template, title, filename, favicon = false) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title,
        filename,
        template,
        inject: true,
        inlineSource: '.(js|css)$',
        favicon,
      }),
    ]
  };
};

// Checks for .css files in the paths referenced in 'includes'
// Runs loaders in right-to-left order
// See: style-loader, css-loader for more information
exports.setupCSS = function (path) {
  return {
    module: {
      rules: [{
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            { loader: 'sass-loader', options: { minimize: true } },
          ],
        }),
      }]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true,
      }),
    ],
  };
};

exports.setupFonts = function (from) {
  return {
    plugins: [
      new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output, 'fonts'),
      }]),
    ],
  };
};

// Compress Images
exports.setupImages = function (from) {
  return {
    plugins: [
      new CopyWebpackPlugin([{
        from,
        to: path.resolve(__dirname, '../', process.env.npm_package_config_paths_output, 'images'),
      }]),
    ],
  };
};
