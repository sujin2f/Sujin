// yarn test schema.spec.ts

import { getSchema } from './schema'
import { GraphQLQueries, GraphQLQuery } from './query-type'
import { GraphQLObjectType, GraphQLString } from './object-type'

describe('schema.ts', () => {
    it('GraphQLQuery()', () => {
        const User = new GraphQLObjectType({
            name: 'User',
            fields: {
                id: { type: GraphQLString, required: true },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
            },
        })

        const query = new GraphQLQuery({
            name: 'user',
            arguments: {
                id: {
                    type: GraphQLString,
                    required: true,
                },
            },
            return: {
                type: User,
            },
        })

        const queries = new GraphQLQueries(query, query)
        const schema = getSchema(queries, User)

        expect(schema.includes('user(id: String!): User')).toBeTruthy()
        expect(schema.includes('type User {')).toBeTruthy()
        expect(schema.includes('name: String')).toBeTruthy()
    })
})
