module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'transform-react-jsx',
      {
        'pragma': 'wp.element.createElement',
      },
    ],
    "@babel/plugin-proposal-class-properties"
  ],
};
