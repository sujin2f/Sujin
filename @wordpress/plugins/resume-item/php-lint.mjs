import { exec } from 'node:child_process'

// TODO ES lint
console.log('\x1B[32m- Running phpCBF... \x1B[0m')
exec('phpcbf -- --standard=WordPress ./*.php ./src/*.php', async (error, stdout, stderr) => {
    if (error) {
        console.log('\x1B[31m- phpCBF error: \x1B[0m', error)
        await restoreFiles()
        return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
})
