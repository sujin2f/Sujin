const configFactory = require('react-scripts/config/webpack.config');
const config = configFactory('development');

config.output.publicPath = '/wp-content/themes/sujin/dist/';

module.exports = config;
