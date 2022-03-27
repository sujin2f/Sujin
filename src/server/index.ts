/**
 * Entry point
 */

/* istanbul ignore file */
import express from 'express'
import { config as dotEnvConfig } from 'dotenv'
import path from 'path'
import moduleAlias from 'module-alias'

/**
 * Get if the current server is development server
 * @return {boolean}
 */
const rootDir =
    process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, '../../../')
        : path.resolve(__dirname, '../../../')

export const baseDir = path.resolve(
    rootDir,
    '.build',
    process.env.NODE_ENV || '',
)

// Alias
if (['production', 'stage'].includes(process.env.NODE_ENV)) {
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
    process.env.NODE_ENV !== 'production'
        ? undefined
        : path.resolve(__dirname, '../', '../', '../', '.env.production')
dotEnvConfig({ path: envPath })

// Create a new express application instance
const app: express.Application = express()
app.use('/graphql', graphqlRouter)
app.use('/', staticRouter)

// Go!
app.listen(3000, () => {
    // tslint:disable-next-line: no-console
    console.log(`🤩 Server started at http://localhost:3000`)
})
