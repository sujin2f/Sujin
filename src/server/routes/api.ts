/**
 * API endpoint
 */

import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import { getMenu, getPostsBy, getBackgrounds } from 'src/server/utils/mysql'
import {
    MenuItemGraphQLType,
    PostGraphQLType,
    BackgroundGraphQLType,
} from 'src/constants/graphql'

const apiRouter = express.Router()

const schema = buildSchema(`
    scalar Date
    type Query {
        getMenu(menuName: String!): [MenuItem]
        getPostsBy(key: String!, value: String!): [Post]
        getBackgrounds: [Background]
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
