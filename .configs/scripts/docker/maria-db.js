const { execSync } = require('child_process')
const passwordGenerator = require('generate-password')

const { colourRed, colourGreen, colourReset } = require('../constants/colour.js')
const env = require('../common/env.js')

class MariaDB {
  // Constants
  CONTAINER_NAME = 'mariadb'
  VOLUME_NAME = 'mysql'

  constructor() {
    const container = this.getContainer()

    if (container) {
      const containerId = this.getContainerId(container)
      env.data.DB_PASSWORD = this.getPasswordFromContainer(containerId).toString().trim()
      return;
    }

    console.log(colourGreen, '[NOTICE]', colourReset, 'MariaDB is not intalled. Installing...')
    this.createContainer()
  }

  getContainer() {
    try {
      const container = execSync(`docker container ls | grep ${this.CONTAINER_NAME}`)
      console.log(colourGreen, '[🎉 OK]', colourReset, 'MariaDB is intalled.')
      return container
    } catch (_) {
      return false
    }
  }

  getContainerId(container) {
    const regex = new RegExp('[0-9a-z]+')
    return regex.exec(container)
  }

  getPasswordFromContainer(containerId) {
    try {
      return execSync(`docker exec ${containerId} bash -c 'echo "$MYSQL_ROOT_PASSWORD"'`)
    } catch (_) {
      console.log(colourRed, '[ERROR]', colourReset, 'Something went wrong to get Docker container $MYSQL_ROOT_PASSWORD of MariaDB.')
      process.exit()
    }
  }

  createContainer() {
    var mariaDbPassword = passwordGenerator.generate({
      length: 15,
      numbers: true,
      uppercase: true,
      symbols: false,
      lowercase: true,
    });

    env.data.DB_PASSWORD = mariaDbPassword

    try {
      execSync(`docker volume inspect ${this.VOLUME_NAME}`)
      console.log(colourGreen, '[🎉 OK]', colourReset, 'Docker volume exists.')
    } catch (_) {
      console.log(colourGreen, '[NOTICE]', colourReset, 'Docker volume does not exist. Installing...')
      this.createVolume()
    }

    execSync(`docker run -d --name ${this.CONTAINER_NAME} --restart=always -e MYSQL_ROOT_PASSWORD="${mariaDbPassword}" -v mysql:/var/lib/mysql -p 3306:3306 mariadb`)
    console.log(colourGreen, '[🎉 OK]', colourReset, 'MariaDb is created.')
  }

  createVolume() {
    execSync(`docker volume create ${this.VOLUME_NAME}`)
  }
}

module.exports = { MariaDB }
