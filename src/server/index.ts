/**
 * Entry point
 */

/* istanbul ignore file */
import express from 'express'
import { config as dotEnvConfig } from 'dotenv'
import compression from 'compression'
import path from 'path'
import moduleAlias from 'module-alias'

const rootDir = process.cwd()
const baseDir = path.resolve(rootDir, '.build', process.env.NODE_ENV || '')
const nodeEnv = process.env.NODE_ENV as string

// Alias
if (['production'].includes(nodeEnv)) {
    moduleAlias.addAlias('src', baseDir)
    moduleAlias()
}

/**
 * .env
 */

if (nodeEnv === 'development') {
    dotEnvConfig({ path: path.resolve(rootDir, `.env`) })
}

/* eslint-disable import/first */
import { staticRouter } from 'src/server/routes/static'
import { graphqlRouter } from 'src/server/routes/graphql'
/* eslint-enable import/first */

// Create a new express application instance
const app: express.Application = express()
app.use('/graphql', graphqlRouter)
app.use('/', staticRouter)

const port = process.env.PORT
// app.use(compression())

function shouldCompress(req: any, res: any) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

// Go!
app.listen(port, () => {
    console.log(`🤩 Server started at http://localhost:${port}`)
})
