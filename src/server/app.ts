/**
 * Entry point
 */

/* istanbul ignore file */
import express from 'express'
import { staticRouter } from 'src/server/components/static/route'

// Create a new express application instance
const app: express.Application = express()
app.use('/', staticRouter)

// Go!
app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
