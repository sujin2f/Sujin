const path = require('path')
const fs = require('fs')

const { colourRed, colourGreen, colourReset } = require('../constants/colour.js')

class Env {
  instance = null
  file = path.resolve(__dirname, '../', '../', '../', '.env')
  data = {}

  constructor() {
    if (!Env.instance) {
      Env.instance = this;

      fs.openSync(this.file)
      const data = fs.readFileSync(this.file, 'utf8')
      this.data = this.readData(data)
    }

    return Env.instance;
  }

  readData(str) {
    const data = {}
    str.split('\n').forEach((line) => {
      const pair = line.split('=')
      if (pair.length > 1) {
        const key = pair.shift()
        data[key] = pair.join('=')
      }
    })
    return data
  }

  isDev() {
    return this.data.ENV === 'development'
  }

  save() {
    const text = Object.keys(this.data)
      .reduce((prev, current) => {
        return `${prev}${current}=${this.data[current]}\n`
      }, '')
    fs.writeFile(this.file, text, () => {});
  }
}

const instance = new Env();
Object.freeze(instance);

module.exports = instance
