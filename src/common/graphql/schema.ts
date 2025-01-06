import { GraphQLObjectType } from './object-type'
import { GraphQLQueries } from './query-type'

export const getSchema = (
    queries: GraphQLQueries,
    ...types: GraphQLObjectType<string>[]
) => [queries.toString(), ...types.map((t) => t.toString())].join('\n')
