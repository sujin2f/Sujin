const env = require('./common/env.js')
env.data.ENV = (process.argv[2] === 'dev') ? 'development' : 'production'
env.save()
