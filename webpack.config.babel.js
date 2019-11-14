/* eslint-disable */
import path from 'path';
import merge from 'webpack-merge';
import {
  setBase,
  setResolve,
  setJS,
  setCSS,
  setFiles,
  setAnalyzer,
} from './.configs/webpack/webpack.config.parts';

const dist = path.resolve(__dirname, 'dist');

const entry = {
  app: path.resolve(__dirname, 'app', 'app.tsx'),
  style: path.resolve(__dirname, 'assets', 'styles', 'style.scss'),
};

const resolve = {
  app: path.resolve(__dirname, 'app'),
};

const wpThemePath = '/wp-content/themes/sujin/dist/';

const config = [
  merge.smart(
    { entry },
    setBase(entry, dist, wpThemePath),
    setResolve(resolve),
    setJS(),
    setCSS(),
    setFiles(wpThemePath),
    setAnalyzer(),
  ),
];

module.exports = config;
