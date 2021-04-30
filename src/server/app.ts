/**
 * Entry point
 */

/* istanbul ignore file */
import express from 'express'
import { config } from 'dotenv'
import { staticRouter } from 'src/server/routes/static'
import { apiRouter } from 'src/server/routes/api'

config()

// Create a new express application instance
const app: express.Application = express()
app.use('/api', apiRouter)
app.use('/', staticRouter)

// Go!
app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
