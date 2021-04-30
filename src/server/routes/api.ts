/**
 * API endpoint
 */

// TODO https://typegraphql.com/
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { getMenu } from 'src/server/utils/mysql'

const apiRouter = express.Router()

const schema = buildSchema(`
    type Query {
        getMenu(menuName: String!): [MenuItem]
    },
    type MenuItem {
        id: Int
        date: String
        content: String
        title: String
        excerpt: String
        parent: Int
        guid: String
        menuOrder: Int
        target: String
        url: String
        type: String
        htmlClass: [String]
        children: [MenuItem]
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
        },
        graphiql: true,
    }),
)

export { apiRouter }
