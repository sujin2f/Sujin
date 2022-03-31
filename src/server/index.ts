/**
 * Entry point
 */

/* istanbul ignore file */
import express from 'express'
import { config as dotEnvConfig } from 'dotenv'
import path from 'path'
import moduleAlias from 'module-alias'

const nodeEnv = process.env.NODE_ENV || ''
const rootDir =
    nodeEnv === 'development'
        ? path.resolve(__dirname, '../../../')
        : path.resolve(__dirname, '../../../')

export const baseDir = path.resolve(rootDir, '.build', nodeEnv)

// Alias
if (['production', 'stage'].includes(nodeEnv)) {
    moduleAlias.addAlias('src', baseDir)
    moduleAlias()
}

/* eslint-disable import/first */
import { staticRouter } from 'src/server/routes/static'
import { graphqlRouter } from 'src/server/routes/graphql'
/* eslint-enable import/first */

/**
 * .env
 */
const envPath =
    nodeEnv === 'development'
        ? undefined
        : path.resolve(__dirname, '../', '../', '../', `.env.${nodeEnv}`)
dotEnvConfig({ path: envPath })

// Create a new express application instance
const app: express.Application = express()
app.use('/graphql', graphqlRouter)
app.use('/', staticRouter)

let port: number = 8080
switch (nodeEnv) {
    case 'development':
        port = 8080
        break
    default:
        port = 80
        break
}

// Go!
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`🤩 Server started at http://localhost:${port}`)
})
