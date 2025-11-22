/**
 * Need at least @graphql
 */
import express from 'express'
import session from 'express-session'
import { Logger } from '@sujin/share/model/Logger'
import { authRoutes } from '@src/router'
import { sessionOption } from '@src/session'

// TODO cors
const app = express()
app.use(session(sessionOption))
app.use('/', authRoutes)

// Start the server
const port = process.env.SERVER_PORT
app.listen(port, () => {
    Logger.info(`🚀 Server ready at http://localhost:${port}`)
})

// TODO Refresh token process
