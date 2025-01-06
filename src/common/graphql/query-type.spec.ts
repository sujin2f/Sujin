// yarn test query-type.spec.ts

import { GraphQLObjectType, GraphQLString } from './object-type'
import { GraphQLQueries, GraphQLQuery } from './query-type'

describe('query-type.ts', () => {
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

    it('toString()', () => {
        const queries = new GraphQLQueries(query, query)

        expect(
            queries.toString().includes('user(id: String!): User'),
        ).toBeTruthy()
    })
})
