/**
 * Environment settings helpers
 */

const path = require('path')
const fs = require('fs')

const rootDir = process.cwd()
exports.rootDir = rootDir

const publicDir = path.resolve(rootDir, 'public')
exports.publicDir = publicDir

const baseDir = path.resolve(rootDir, '.build', process.env.NODE_ENV || '')
exports.baseDir = baseDir

exports.bundles = function () {
    const manifest = path.resolve(baseDir, 'frontend', 'manifest.json')
    const raw = fs.readFileSync(manifest).toString()
    return JSON.parse(raw)
}
