import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'

const dirModule = path.join('internal_modules')
const dirTemp = path.join('temp')
const dirCommonModules = {
    lib: path.join('..', '@lib', 'src'),
    'node-cache': path.join('..', '@common', 'node-cache', 'src'),
    share: path.join('..', '@common', 'share', 'src'),
}

const files = {
    packageJson: 'package.json',
    tsConfig: 'tsconfig.webpack.json',
    envDev: '.env',
    envProd: '.env.production',
    webpack: 'webpack.config.mjs',
}

// Importing file contents
import packageJson from './package.json' with { type: 'json' }
delete packageJson.dependencies['@sujin/lib']
delete packageJson.dependencies['@sujin/node-cache']
delete packageJson.dependencies['@sujin/share']

import tsConfig from './tsconfig.webpack.json' with { type: 'json' }
tsConfig.compilerOptions.paths['@sujin/*'] = ['./internal_modules/*']

let env = await fs.promises.readFile(path.join(files.envProd))
const VERSION = packageJson.version
env += `VERSION=${VERSION}\n\r`

let webpack = await fs.promises.readFile(path.join(files.webpack), 'utf8')
const target = `'@src': path.resolve(import.meta.dirname, 'src'),`
const alias = `${target} '@sujin': path.resolve(import.meta.dirname, 'internal_modules')`
webpack = webpack.replace(target, alias)

const createDirectories = async () => {
    console.log('Creating directories...')
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
    console.log('Backup files...')
    // package.json
    await fs.promises.copyFile(
        path.join(files.packageJson),
        path.join(dirTemp, files.packageJson),
    )

    // tsconfig.webpack.json
    await fs.promises.copyFile(
        path.join(files.tsConfig),
        path.join(dirTemp, files.tsConfig),
    )

    // .env
    await fs.promises.copyFile(
        path.join(files.envDev),
        path.join(dirTemp, files.envDev),
    )

    // webpack
    await fs.promises.copyFile(
        path.join(files.webpack),
        path.join(dirTemp, files.webpack),
    )
}

const modifyFiles = async () => {
    console.log('Modifying files...')
    // package.json
    await fs.promises.writeFile(
        path.join(files.packageJson),
        JSON.stringify(packageJson, null, 2),
    )

    // tsconfig.webpack.json
    await fs.promises.writeFile(
        path.join(files.tsConfig),
        JSON.stringify(tsConfig, null, 2),
    )

    // .env
    await fs.promises.unlink(path.join(files.envDev))
    await fs.promises.copyFile(
        path.join(files.envProd),
        path.join(files.envDev),
    )
    await fs.promises.writeFile(path.join(files.envDev), env)

    // webpack
    await fs.promises.writeFile(path.join(files.webpack), webpack)
}

const restoreFiles = async () => {
    console.log('Restore files...')
    await fs.promises.unlink(path.join(files.packageJson))
    await fs.promises.unlink(path.join(files.tsConfig))
    await fs.promises.unlink(path.join(files.envDev))
    await fs.promises.unlink(path.join(files.webpack))

    await fs.promises.copyFile(
        path.join(dirTemp, files.packageJson),
        path.join(files.packageJson),
    )
    await fs.promises.copyFile(
        path.join(dirTemp, files.tsConfig),
        path.join(files.tsConfig),
    )
    await fs.promises.copyFile(
        path.join(dirTemp, files.envDev),
        path.join(files.envDev),
    )
    await fs.promises.copyFile(
        path.join(dirTemp, files.webpack),
        path.join(files.webpack),
    )
}

await createDirectories()
await backupFiles()
await modifyFiles()

console.log('Creating Docker image...')
exec(
    `docker build -t sujin2f/graphql:${VERSION} .`,
    (error, stdout, stderr) => {
        if (error) {
            console.error(`docker build error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)

        console.log('Running docker compose')
        exec(`docker-compose up -d`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`docker build error: ${error}`)
                return
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)

            await restoreFiles()
        })
    },
)
