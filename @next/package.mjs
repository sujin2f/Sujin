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
    env: '.env',
}

// Version
import packageJson from './package.json' with { type: 'json' }
const VERSION = packageJson.version

// Overwrite VERSION info
let env = await fs.promises.readFile(path.join(files.env), 'utf-8')
env = env.replace(/VERSION=[0-9.beta-]+\n/g, '')
env += `VERSION=${VERSION}\n`
await fs.promises.writeFile(path.join(files.env), env)
console.log('🤟 \x1B[32m- Version updated. \x1B[0m')

// Check if Docker image exists
const image = `sujin2f/next:${VERSION}`
const { stdout  } = await execPromise(`docker image ls ${image}`)
if (stdout.includes(image)) {
    console.error(`⛈️ Image ${image} already exists.`)
    process.exit(1)
}

// tsconfig.json
import tsConfig from './tsconfig.json' with { type: 'json' }
delete tsConfig.compilerOptions.paths['@sujin/lib/*']
delete tsConfig.compilerOptions.paths['@sujin/share/*']
tsConfig.compilerOptions.paths['@sujin/*'] = ['./internal_modules/*']
tsConfig.exclude = ["node_modules", "**/*.spec.ts", "**/*.spec.tsx"]

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
}

const modifyFiles = async () => {
    console.log('🤟 \x1B[32m- Modifying files... \x1B[0m')
    // tsconfig.webpack.json
    await fs.promises.writeFile(path.join(files.tsConfig), JSON.stringify(tsConfig, null, 2))
}

const restoreFiles = async () => {
    console.log('🤟 \x1B[32m- Restore files... \x1B[0m')
    await fs.promises.unlink(path.join(files.tsConfig))

    await fs.promises.copyFile(path.join(dirTemp, files.tsConfig), path.join(files.tsConfig))

    await fs.promises.rm(dirModule, { recursive: true, force: true })
    await fs.promises.rm(dirTemp, { recursive: true, force: true })
}

await createDirectories()
await backupFiles()
await modifyFiles()

console.log('🤟 \x1B[32m- Creating Docker image... \x1B[0m')
exec(`docker build -t ${image} .`, async (error, stdout, stderr) => {
    if (error) {
        console.error('🤬 \x1B[31m- docker build error: \x1B[0m', error)
        await restoreFiles()
        return
    }
    console.log(`👀 stdout: ${stdout}`)
    console.error(`👀 stderr: ${stderr}`)

    // Delay 1 sec for finishing build
    setTimeout(() => {}, 1000); 

    console.log('🤟 \x1B[32m- Running docker compose... \x1B[0m')
    exec(`docker-compose up -d --remove-orphans`, async (error, stdout, stderr) => {
        if (error) {
            console.error('🤬 \x1B[31m- docker compose error: \x1B[0m', error)
            await restoreFiles()
            return
        }
        console.log(`👀 stdout: ${stdout}`)
        console.error(`👀 stderr: ${stderr}`)

        await restoreFiles()
    })
})
