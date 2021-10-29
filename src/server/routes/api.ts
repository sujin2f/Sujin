/**
 * GraphQL endpoint
 */

import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { graphqlSchema } from 'src/constants'
import { getMenu, getPostsBy, getBackgrounds } from 'src/utils/'

const apiRouter = express.Router()
const schema = buildSchema(graphqlSchema)

apiRouter.use(
    '/',
    graphqlHTTP({
        schema,
        rootValue: {
            getMenu,
            getPostsBy,
            getBackgrounds,
        },
        graphiql: true,
    }),
)

export { apiRouter }
