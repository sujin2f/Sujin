/**
 * API endpoint
 */

// TODO https://typegraphql.com/
import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { getMenu } from 'src/server/utils/mysql'
import { MenuItemGraphQLType } from 'src/types/wp'

const apiRouter = express.Router()

const schema = buildSchema(`
    type Query {
        getMenu(menuName: String!): [MenuItem]
    },
    ${MenuItemGraphQLType}
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
