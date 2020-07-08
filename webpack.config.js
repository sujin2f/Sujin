const configFactory = require('react-scripts/config/webpack.config')
const config = 'development' === process.env.NODE_ENV ? configFactory('development') : configFactory('production')
config.output.publicPath = 'development' === process.env.NODE_ENV ? '/wp-content/themes/sujin/dist/' : '/wp-content/themes/sujin/build/'
module.exports = config
