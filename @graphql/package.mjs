/* eslint-disable no-console */
/**
 * @use yarn package -- graphql:1.0.0 sudo
 */
import { exec } from 'node:child_process'
import util from 'util'
const execPromise = util.promisify(exec)

// Version & sudo
const VERSION = process.env.npm_package_version
const sudo = process.argv.indexOf('sudo') !== -1 ? 'sudo ' : ''

// Check if Docker image exists
let image = `sujin2f/graphql:${VERSION}`
const { stdout } = await execPromise(`${sudo}docker image ls ${image}`)
if (stdout.includes(image)) {
    console.error(`⛈️ Image ${image} already exists.`)
    process.exit(1)
}

console.log('🤞 \x1B[32m- Creating Docker image... \x1B[0m')
exec(`${sudo}docker build -t ${image} .`, async (error, stdout, stderr) => {
    if (error) {
        console.error('🤬 \x1B[31m- docker build error: \x1B[0m', error)
        return
    }
    console.log(`👀 stdout: ${stdout}`)
    console.error(`👀 stderr: ${stderr}`)
})
