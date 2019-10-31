/* eslint-disable */
import path from 'path';
import merge from 'webpack-merge';
import parts from './webpack.config.parts';

const dist = path.resolve(__dirname, 'dist');
const entry = {
  app: path.resolve(__dirname, 'app', 'app.tsx'),
  style: path.resolve(__dirname, 'assets', 'styles', 'style.scss'),
};

const config = [
  merge.smart(
    {
      entry,
    },
    parts.setBase(entry, dist),
    parts.setResolve(),
  ),
];

module.exports = config;
