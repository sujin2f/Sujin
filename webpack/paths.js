const path = require('path')
const env = require('../src/common/utils/path.ts')

module.exports = {
    root: path.resolve(env.rootDir),
    outputPath: path.resolve(env.baseDir, 'frontend'),
    entryPath: path.resolve(env.rootDir, 'src/frontend/index.tsx'),
}
