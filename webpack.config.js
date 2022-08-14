// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const configFactory = require('react-scripts/config/webpack.config')
const config =
    'development' === process.env.NODE_ENV
        ? configFactory('development')
        : configFactory('production')

config.entry = [path.resolve(__dirname, 'src', 'frontend', 'index.tsx')]

config.output.path = path.resolve(
    __dirname,
    '.build',
    process.env.NODE_ENV,
    'frontend',
)

if ('stage' === process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production'
}

module.exports = config
