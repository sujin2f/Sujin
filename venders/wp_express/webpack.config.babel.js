/* eslint-disable */
import path from 'path';
import merge from 'webpack-merge';
import parts from './webpack.config.parts';

const dist = path.resolve(__dirname, 'assets', 'dist');
const entry = {
  'media-upload': path.resolve(__dirname, 'assets', 'scripts', 'media-upload.js'),
  'meta': path.resolve(__dirname, 'assets', 'styles', 'meta.scss'),
};

const config = [
  merge.smart(
    {
      entry,
    },
    parts.setBase(entry, dist),
  ),
];

module.exports = config;
