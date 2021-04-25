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
    const execProxy = `
      docker run -d
        --name ${this.CONTAINER_NAME}
        --restart=always
        -v ~/.nginx-proxy/certs:/etc/nginx/certs
        -v ~/.nginx-proxy/vhost:/etc/nginx/vhost.d
        -v ~/.nginx-proxy/html:/usr/share/nginx/html
        -v /var/run/docker.sock:/tmp/docker.sock:ro
        -p 80:80
        -p 443:443
        jwilder/nginx-proxy

        &&

        docker exec -d ${this.CONTAINER_NAME}
          sh -c "
            touch /etc/nginx/conf.d/max_size.conf &&
            echo 'client_max_body_size 100M;' > /etc/nginx/conf.d/max_size.conf &&
            forego start -r"
    `.replace(/\r?\n|\r/g, ' ')
    execSync(execProxy)

    const execAcme = `
      docker run -d
        --name ${this.CONTAINER_NAME}-acme
        --restart=always
        --volumes-from ${this.CONTAINER_NAME}
        -v /var/run/docker.sock:/var/run/docker.sock:ro
        -v ~/.nginx-proxy/acme:/etc/acme.sh
        --env "DEFAULT_EMAIL=${env.data.EMAIL}"
        nginxproxy/acme-companion
    `.replace(/\r?\n|\r/g, ' ')
    execSync(execAcme)
  }
}

module.exports = { Proxy }
