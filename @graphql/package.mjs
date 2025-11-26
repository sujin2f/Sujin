import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'
import { config } from 'dotenv'
import util from 'util'
config()
const execPromise = util.promisify(exec)

const dirModule = path.join('internal_modules')
const dirTemp = path.join('temp')
const dirCommonModules = {
    lib: path.join('..', '@lib', 'src'),
    share: path.join('..', '@common', 'src'),
}

const files = {
    tsConfig: 'tsconfig.json',
    envDev: '.env',
    envProd: '.env.production',
    webpack: 'webpack.config.mjs',
    package: 'package.json',
}

// Version
let packageJson = await fs.promises.readFile(path.join(files.package), 'utf-8')
packageJson = JSON.parse(packageJson)
const VERSION = packageJson.version

// Overwrite VERSION info
let env = await fs.promises.readFile(path.join(files.envProd), 'utf-8')
let envDev = await fs.promises.readFile(path.join(files.envDev), 'utf-8')
env = env.replace(/VERSION=[0-9.beta-]+\n/g, '')
env += `VERSION=${VERSION}\n`
envDev = env.replace(/VERSION=[0-9.beta-]+\n/g, '')
envDev += `VERSION=${VERSION}\n`
await fs.promises.writeFile(path.join(files.envProd), envDev)
await fs.promises.writeFile(path.join(files.envDev), envDev)
console.log('🤟 \x1B[32m- Version updated. \x1B[0m')

// Check if Docker image exists
const image = `sujin2f/graphql:${VERSION}`
const { stdout, stderr } = await execPromise(`sudo docker image ls ${image}`)

// tsconfig.json
import tsConfig from './tsconfig.json' with { type: 'json' }
delete tsConfig.compilerOptions.paths['@sujin/lib/*']
delete tsConfig.compilerOptions.paths['@sujin/share/*']
tsConfig.compilerOptions.paths['@sujin/*'] = ['./internal_modules/*']
tsConfig.exclude = ['node_modules', 'src/**/*.spec.ts']

// webpack
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

    // .env
    await fs.promises.copyFile(path.join(files.envDev), path.join(dirTemp, files.envDev))

    // webpack
    await fs.promises.copyFile(path.join(files.webpack), path.join(dirTemp, files.webpack))
}

const modifyFiles = async () => {
    console.log('🤟 \x1B[32m- Modifying files... \x1B[0m')
    // tsconfig.webpack.json
    await fs.promises.writeFile(path.join(files.tsConfig), JSON.stringify(tsConfig, null, 2))

    // .env
    await fs.promises.unlink(path.join(files.envDev))
    await fs.promises.copyFile(path.join(files.envProd), path.join(files.envDev))
    await fs.promises.writeFile(path.join(files.envDev), env)

    // webpack
    await fs.promises.writeFile(path.join(files.webpack), webpack)
}

const restoreFiles = async () => {
    console.log('🤟 \x1B[32m- Restore files... \x1B[0m')
    await fs.promises.unlink(path.join(files.tsConfig))
    await fs.promises.unlink(path.join(files.envDev))
    await fs.promises.unlink(path.join(files.webpack))

    await fs.promises.copyFile(path.join(dirTemp, files.tsConfig), path.join(files.tsConfig))
    await fs.promises.copyFile(path.join(dirTemp, files.envDev), path.join(files.envDev))
    await fs.promises.copyFile(path.join(dirTemp, files.webpack), path.join(files.webpack))

    await fs.promises.rm(dirModule, { recursive: true, force: true })
    await fs.promises.rm(dirTemp, { recursive: true, force: true })
}

await createDirectories()
await backupFiles()
await modifyFiles()

console.log('🤟 \x1B[32m- Creating Docker image... \x1B[0m')
exec(
    `sudo docker build --build-arg SERVER_PORT=${process.env.SERVER_PORT} -t ${image} .`,
    async (error, stdout, stderr) => {
        if (error) {
            console.error('🤬 \x1B[31m- docker build error: \x1B[0m', error)
            await restoreFiles()
            return
        }
        console.log(`👀 stdout: ${stdout}`)
        console.error(`👀 stderr: ${stderr}`)

        // Delay 1 sec for finishing build
        setTimeout(() => {}, 1000)

        console.log('🤟 \x1B[32m- Running docker compose... \x1B[0m')
        exec(`sudo docker-compose up -d --remove-orphans`, async (error, stdout, stderr) => {
            if (error) {
                console.error('🤬 \x1B[31m- docker compose error: \x1B[0m', error)
                await restoreFiles()
                return
            }
            console.log(`👀 stdout: ${stdout}`)
            console.error(`👀 stderr: ${stderr}`)

            await restoreFiles()
        })
    },
)
