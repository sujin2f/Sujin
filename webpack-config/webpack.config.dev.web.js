/* eslint-disable */
import merge from 'webpack-merge';
import path from 'path';
import config from 'config';
import parts from './webpack.config.parts';

const destinations = [
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_app),
  path.resolve(__dirname, '../', process.env.npm_package_config_paths_src, 'web'),
];

export default merge.smart(
  parts.setupBase(),
  parts.setupEntries({
    app: path.resolve(destinations[0], 'assets', 'styles', 'app.scss'),
    style: path.resolve(destinations[1], 'app.js'),
  }),
  parts.setupResolves({
    app: destinations[0],
    src: destinations[1],
  }),
  parts.setupTemplate(
    path.resolve(process.env.npm_package_config_paths_templates, 'index-web.ejs'),
    process.env.npm_package_config_productName,
    'index.html',
    path.resolve(process.env.npm_package_config_paths_app, 'assets', 'images', 'favicon.png')
  ),
  parts.setupFriendlyErrors(),
  parts.setupLoaderOptions(),
  parts.setupNoEmit(),
  parts.setupLint(destinations),
  parts.setupBabel(destinations),
  parts.setupDevServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
    proxy: config.has('webpack-dev-server.proxy') ? config.get('webpack-dev-server.proxy') : undefined
  }),
  parts.setupCSS(destinations),
  parts.setupFonts(path.resolve(destinations[0], 'assets', 'fonts')),
  parts.setupImages(path.resolve(destinations[0], 'assets', 'images'))
);
