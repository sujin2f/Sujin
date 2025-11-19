import * as fs from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'

const dirModule = path.join('internal_modules')
const dirTemp = path.join('temp')
const dirCommonModules = {
    share: path.join('..', '@common', 'src'),
}

const files = {
    tsConfig: 'tsconfig.json',
}

// Importing file contents
import tsConfig from './tsconfig.json' with { type: 'json' }
delete tsConfig.compilerOptions.paths['@sujin/share/*']
tsConfig.compilerOptions.paths['@sujin/*'] = ['./internal_modules/*']

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
    // tsconfig.json
    await fs.promises.copyFile(path.join(files.tsConfig), path.join(dirTemp, files.tsConfig))
}

const modifyFiles = async () => {
    console.log('Modifying files...')
    // tsconfig.json
    await fs.promises.writeFile(path.join(files.tsConfig), JSON.stringify(tsConfig, null, 2))
}

const restoreFiles = async () => {
    console.log('Restore files...')
    await fs.promises.unlink(path.join(files.tsConfig))

    await fs.promises.copyFile(path.join(dirTemp, files.tsConfig), path.join(files.tsConfig))
}

await createDirectories()
await backupFiles()
await modifyFiles()

console.log('Build...')
exec(`yarn build:tsc`, async (error, stdout, stderr) => {
    if (error) {
        console.error(`tsc build error: ${error}`)
        await restoreFiles()
        return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)

    await restoreFiles()
})
