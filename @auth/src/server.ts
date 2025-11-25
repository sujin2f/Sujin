import express from 'express'
import session from 'express-session'
import cors from 'cors'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { googleRoutes } from '@src/routers/google'
import { sessionOption } from '@src/session'

const allowedOrigins = JSON.parse(`${process.env.CORS_ORIGINS}`)

const app = express()
app.use(session(sessionOption))
app.set('trust proxy', 1) // Trust first proxy

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true)
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
                Logger.error(
                    `🤬 The CORS policy for this site does not allow access from the specified Origin. ${origin}`,
                )
                return callback(new Error(msg), false)
            }
            return callback(null, true)
        },
        credentials: true, // If you need to send cookies or authentication headers
    }),
)
app.use('/', googleRoutes)

// Start the server
const port = process.env.SERVER_PORT
app.listen(port, () => {
    Logger.info(`🚀 Server ready at http://localhost:${port}`)
})

// TODO jest
