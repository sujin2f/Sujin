import { DAY_IN_SECONDS } from '@common/constants/datetime'
import type { IQuery, ScalarJSType } from '.'
import { Error } from '@common/model/Error'

export const fetchGQL = <A extends ScalarJSType[], R>(
    query: IQuery<A, R>,
    fields: string,
    ttl: number,
    ...args: A
): Promise<R> =>
    fetch(`/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: query.toOperation(fields, ...args),
        cache: 'force-cache',
        next: { revalidate: ttl || DAY_IN_SECONDS },
    })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error(
                    `GraphQL query failed for query ${query.name} and ${args}`,
                    { level: 'log' },
                )
            }
            return response.json()
        })
        .then((data) => {
            const value = data.data[query.name]
            if (!value) {
                throw new Error(
                    `GraphQL query failed for query ${query.name} and ${args}`,
                    { level: 'log' },
                )
            }
            return value as R
        })
