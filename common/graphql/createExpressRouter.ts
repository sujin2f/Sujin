import type { IQuery, IType, ScalarJSType } from '.'

export const createGQLOptions = (
    ...typesOrQueries: (IType<unknown> | IQuery<ScalarJSType[], unknown>)[]
) => {
    const queries = typesOrQueries.filter((item) => 'rtn' in item)
    const types = typesOrQueries.filter((item) => !('rtn' in item))
    const schema = `type Query{\n${queries.map((query) => query.toString()).join('\n')}\n}\n${types.map((type) => type.toString()).join('\n')}`
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

    return {
        schema,
        rootValue,
    }
}
