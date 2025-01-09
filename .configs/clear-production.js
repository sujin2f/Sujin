import path from 'path'
import fs from 'fs'

import { config as dotEnvConfig } from 'dotenv'

const deleteDirRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            var curPath = path + '/' + file
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteDirRecursive(curPath)
            } else {
                // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

// Read VERSION from .env
const rootDir = process.cwd()
dotEnvConfig({ path: path.resolve(rootDir, '.env') })

if (!process.env.VERSION) {
    throw Error('Please add VERSION to your .env file')
}

const dest = path.resolve(rootDir, '.build', 'production')

// Remove all except frontend
if (fs.existsSync(dest)) {
    fs.readdir(dest, (err, dirs) => {
        if (err) throw err

        for (const dir of dirs) {
            if (dir !== 'frontend') {
                deleteDirRecursive(path.join(dest, dir))
            }
        }
    })
}

const destFront = path.resolve(
    rootDir,
    '.build',
    'production',
    'frontend',
    process.env.VERSION,
)
// Remove frontend version
if (fs.existsSync(destFront)) {
    deleteDirRecursive(destFront)
}
