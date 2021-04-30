/**
 * API endpoint
 */

import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { getMenu, getPostsBy, getBackground } from 'src/server/utils/mysql'
import {
    MenuItemGraphQLType,
    PostGraphQLType,
    BackgroundGraphQLType,
} from 'src/types'

const apiRouter = express.Router()

const schema = buildSchema(`
    type Query {
        getMenu(menuName: String!): [MenuItem]
        getPostsBy(key: String!, value: String!): [Post]
        getBackground: [Background]
    },
    type MenuItem {
        ${MenuItemGraphQLType}
    },
    type Post {
        ${PostGraphQLType}
    },
    type Background {
        ${BackgroundGraphQLType}
    }
`)

/**
 * Show react frontend
 *
 * @param {Response} res
 * @return {void}
 */
apiRouter.use(
    '/',
    graphqlHTTP({
        schema: schema,
        rootValue: {
            getMenu,
            getPostsBy,
            getBackground,
        },
        graphiql: true,
    }),
)

export { apiRouter }
