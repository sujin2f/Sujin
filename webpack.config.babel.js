/* eslint-disable */
import path from 'path';
import merge from 'webpack-merge';
import parts from './webpack.config.parts';

const dist = path.resolve(__dirname, 'dist');

const config = [
  merge.smart(
    {
      // Entry points, resolver path, and output path
      entry: {
        app: path.resolve(__dirname, 'app', 'app.jsx'),
      },
    },
    parts.setBase(dist),
    parts.setResolve(),

  ),
];

module.exports = config;
