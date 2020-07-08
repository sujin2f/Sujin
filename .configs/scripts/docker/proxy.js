const { execSync } = require('child_process')

const { colourRed, colourGreen, colourReset } = require('../constants/colour.js')
const env = require('../common/env.js')

class Proxy {
  // Constants
  CONTAINER_NAME = 'nginx-proxy'
  VOLUME_NAME = 'mysql'

  constructor() {
    const container = this.getContainer()

    if (container) {
      return;
    }

    console.log(colourGreen, '[NOTICE]', colourReset, 'nginx-proxy is not intalled. Installing...')
    this.createContainer()
  }

  getContainer() {
    try {
      const container = execSync(`docker container ls | grep ${this.CONTAINER_NAME}`)
      console.log(colourGreen, '[🎉 OK]', colourReset, 'nginx-proxy is intalled.')
      return container
    } catch (_) {
      return false
    }
  }

  createContainer() {
    execSync(`docker run -d --name ${this.CONTAINER_NAME} --restart=always -v /var/run/docker.sock:/tmp/docker.sock:ro -p 80:80 jwilder/nginx-proxy`)
    execSync(`docker exec -d ${this.CONTAINER_NAME} sh -c "touch /etc/nginx/conf.d/max_size.conf && echo 'client_max_body_size 100M;' > /etc/nginx/conf.d/max_size.conf && forego start -r"`)
  }
}

module.exports = { Proxy }
