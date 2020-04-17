/* eslint-disable */
// const path = require('path');
// const HtmlWebpackPlugin = require('react-scripts/node_modules/html-webpack-plugin');
// const ManifestPlugin = require('react-scripts/node_modules/webpack-manifest-plugin');

const configFactory = require('react-scripts/config/webpack.config');
const config = configFactory('development');

config.output.publicPath = '/wp-content/themes/sujin/dist/';

/*
config.entry = {
  'app': path.resolve(__dirname, 'src', 'index.tsx'),
  'style': path.resolve(__dirname, 'assets', 'styles', 'style.scss'),
};
*/

/*
config.entry = [
  path.resolve(__dirname, 'src', 'index.tsx'),
  path.resolve(__dirname, 'assets', 'styles', 'style.scss'),
];
*/

// config.output.filename = 'static/js/[name].js';

/*
const lastRule = config.module.rules.pop();
lastRule.oneOf = lastRule.oneOf.filter(rule => {
  if (rule.test && rule.test.toString().includes('scss|sass') && !rule.test.toString().includes('module')) {
    return false;
  }
  return true;
});

config.module.rules = [
  ...config.module.rules,
  {
    test: /\.(scss|sass)$/,
    use: [
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
  lastRule,
];

config.plugins = config.plugins.filter(plugin => {
  if (plugin instanceof HtmlWebpackPlugin) {
    return false;
  }

  if (plugin instanceof ManifestPlugin) {
console.log(plugin);
console.log(plugin.opts.generate);
console.log(plugin.opts.serialize);
  }
  return true;
});

console.log(config);
*/
// return;

module.exports = config;
