const { execSync } = require('child_process')

const { MariaDB } = require('./docker/maria-db.js')
const { Proxy } = require('./docker/proxy.js')
const { Wordpress } = require('./docker/wordpress.js')

const env = require('./common/env.js')
const { colourRed, colourGreen, colourReset } = require('./constants/colour.js')

// Check docker installation
const runDocker = () => {
  try {
    execSync('docker -v')
    console.log(colourGreen, '[🎉 OK]', colourReset, 'Docker is intalled.')
    return true
  } catch (_) {
    console.log(colourRed, '[ERROR]', colourReset, 'Docker needs to be intalled.')
    process.exit()
  }
}

env.data.ENV = (process.argv[2] === 'dev') ? 'development' : 'production'
env.data.SKIP_PREFLIGHT_CHECK = 'true'

runDocker();

new MariaDB()
new Proxy()
new Wordpress()

env.save()

console.log(colourGreen, '[🎉 OK]', colourReset, 'All done. Enjoy!')
