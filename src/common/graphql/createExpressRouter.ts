import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

import type { IQuery, IType, ScalarJSType } from '.'
import { GQLQuery } from './query'

export const createExpressRouter = (
    ...typesOrQueries: (IType<unknown> | IQuery<ScalarJSType[], unknown>)[]
) => {
    const graphqlRouter = express.Router()

    const queries = typesOrQueries.filter((item) => 'rtn' in item)
    const types = typesOrQueries.filter((item) => !('rtn' in item))
    const strSchema = `type Query{\n${queries.map((query) => query.toString()).join('\n')}\n}\n${types.map((type) => type.toString()).join('\n')}`
    const schema = buildSchema(strSchema)
    const rootValue = queries.reduce((acc, query) => {
        if (!query.callback) {
            throw Error(
                `Please assign callback to ${query.name} in order to use router`,
            )
        }

        return {
            ...acc,
            [query.name]: query.callback,
        }
    }, {})

    graphqlRouter.use(
        '/',
        graphqlHTTP({
            schema,
            rootValue,
            graphiql: true,
        }),
    )

    return graphqlRouter
}
