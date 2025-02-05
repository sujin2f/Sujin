import type { IQuery, IType, ScalarJSType } from '.'
import { OperationType } from './constants'

export const createGQLOptions = (
    ...typesOrQueries: (IType<unknown> | IQuery<ScalarJSType[], unknown>)[]
) => {
    const queries = typesOrQueries.filter((item) => 'rtn' in item)
    const types = typesOrQueries.filter((item) => !('rtn' in item))

    const queryArr = queries.filter(
        (query) => query.type === OperationType.QUERY,
    )
    const mutationArr = queries.filter(
        (query) => query.type === OperationType.MUTATION,
    )

    const query = queryArr.length
        ? `type Query{\n${queryArr
              .map((query) => query.toString())
              .join('\n')}\n}`
        : ''
    const mutation = mutationArr.length
        ? `type Mutation{\n${mutationArr
              .map((query) => query.toString())
              .join('\n')}\n}`
        : ''
    const type = types.map((type) => type.toString()).join('\n')

    const queryResolver = queryArr.reduce((acc, query) => {
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

    const mutationResolver = mutationArr.reduce((acc, query) => {
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

    const resolvers = {
        Query: queryResolver,
        Mutation: mutationResolver,
    }

    return {
        schema: `${query}\n${mutation}\n${type}`,
        resolvers,
    }
}
