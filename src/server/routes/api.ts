/**
 * GraphQL endpoint
 */

import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from 'src/constants'
import {
    getMenu,
    getGraphPostsBy,
    getBackgrounds,
    getTermBy,
    getFlickr,
    getTagCloud,
} from 'src/utils/'

const apiRouter = express.Router()
const schema = buildSchema(graphqlSchema)

apiRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            getMenu,
            getPostsBy: getGraphPostsBy,
            getBackgrounds,
            getTermBy,
            getFlickr,
            getTagCloud,
        },
        graphiql: true,
    }),
)

export { apiRouter }
