/* eslint-disable no-console */
/**
 * @use yarn package -- auth:1.0.0 sudo
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'
import { subtle, getRandomValues } from 'node:crypto'
import util from 'util'
const execPromise = util.promisify(exec)

const dirModule = path.join('internal_modules')
const dirTemp = path.join('temp')
const dirCommonModules = {
    lib: path.join('..', '@lib', 'src'),
    share: path.join('..', '@common', 'src'),
}
const files = {
    tsConfig: 'tsconfig.json',
    env: '.env',
    webpack: 'webpack.config.mjs',
}

// Version & sudo
const VERSION = process.env.npm_package_version
const sudo = process.argv.indexOf('sudo') !== -1 ? 'sudo ' : ''

// Check if Docker image exists
let image = `sujin2f/auth:${VERSION}`
const { stdout } = await execPromise(`${sudo}docker image ls ${image}`)
if (stdout.includes(image)) {
    console.error(`⛈️ Image ${image} already exists.`)
    process.exit(1)
}

const generateCryptoKey = async () => {
    console.log('🤟 \x1B[32m- Generating key... \x1B[0m')

    const bufferToBase64 = (buffer) => {
        const bytes = new Uint8Array(buffer)

        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    }

    // generate crypto key (you can use the same code from @common/utils/crypto)
    const key = await subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
    const exported = await crypto.subtle.exportKey('jwk', key)
    const iv = getRandomValues(new Uint8Array(12))
    const merged = JSON.stringify([exported.k, bufferToBase64(iv.buffer)])
    return btoa(merged)
}
const CRYPTO_KEY = generateCryptoKey()
console.info(`👀 The crypto key is ${CRYPTO_KEY}. Apply this to @next, @graphql, and @wordpress`)

// Replace tsconfig.json
import tsConfig from './tsconfig.json' with { type: 'json' }
delete tsConfig.compilerOptions.paths['@sujin/lib/*']
delete tsConfig.compilerOptions.paths['@sujin/share/*']
tsConfig.compilerOptions.paths['@sujin/*'] = ['./internal_modules/*']
tsConfig.exclude = ['node_modules', 'src/**/*.spec.ts', '.jest/*']

// Replace webpack configuration
let webpack = await fs.promises.readFile(path.join(files.webpack), 'utf8')
webpack = webpack.replace(`'@sujin/lib': path.resolve(import.meta.dirname, '..', '@lib', 'src'),`, '')
webpack = webpack.replace(`'@sujin/share': path.resolve(import.meta.dirname, '..', '@common', 'src'),`, '')
const target = `'@src': path.resolve(import.meta.dirname, 'src'),`
const alias = `${target} '@sujin': path.resolve(import.meta.dirname, 'internal_modules')`
webpack = webpack.replace(target, alias)

const createDirectories = async () => {
    console.log('🤟 \x1B[32m- Creating directories... \x1B[0m')
    await fs.promises.mkdir(dirModule)
    await fs.promises.mkdir(dirTemp)

    for (const key of Object.keys(dirCommonModules)) {
        const destination = path.join(dirModule, key)
        await fs.promises.cp(dirCommonModules[key], destination, {
            recursive: true,
        })
    }
}

const backupFiles = async () => {
    console.log('🤟 \x1B[32m- Backup files... \x1B[0m')
    // tsconfig.webpack.json
    await fs.promises.copyFile(path.join(files.tsConfig), path.join(dirTemp, files.tsConfig))

    // webpack
    await fs.promises.copyFile(path.join(files.webpack), path.join(dirTemp, files.webpack))
}

const modifyFiles = async () => {
    console.log('🤟 \x1B[32m- Modifying files... \x1B[0m')
    // tsconfig.webpack.json
    await fs.promises.writeFile(path.join(files.tsConfig), JSON.stringify(tsConfig, null, 2))

    // webpack
    await fs.promises.writeFile(path.join(files.webpack), webpack)
}

const restoreFiles = async () => {
    console.log('🤟 \x1B[32m- Restore files... \x1B[0m')
    await fs.promises.unlink(path.join(files.tsConfig))
    await fs.promises.unlink(path.join(files.webpack))

    await fs.promises.copyFile(path.join(dirTemp, files.tsConfig), path.join(files.tsConfig))
    await fs.promises.copyFile(path.join(dirTemp, files.webpack), path.join(files.webpack))

    await fs.promises.rm(dirModule, { recursive: true, force: true })
    await fs.promises.rm(dirTemp, { recursive: true, force: true })
}

await createDirectories()
await backupFiles()
await modifyFiles()

console.log(`🤟 \x1B[32m- Creating Docker image ${image} with port ${process.env.SERVER_PORT}... \x1B[0m`)
exec(`${sudo}docker build -t ${image} .`, async (error, stdout, stderr) => {
    if (error) {
        console.error('🤬 \x1B[31m- docker build error: \x1B[0m', error)
        await restoreFiles()
        return
    }
    console.log(`👀 stdout: ${stdout}`)
    console.error(`👀 stderr: ${stderr}`)
    await restoreFiles()
})
