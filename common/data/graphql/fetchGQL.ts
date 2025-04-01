import { DAY_IN_SECONDS } from '@common/constants/datetime'
import type { IQuery, ScalarJSType } from '.'
import { VERSION } from '../../constants/helper'

export const fetchGQL = <A extends ScalarJSType[], R>(
    query: IQuery<A, R>,
    fields: string,
    ttl: number,
    ...args: A
): Promise<R> =>
    fetch(`/api/graphql/${VERSION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: query.toOperation(fields, ...args),
        cache: 'force-cache',
        next: { revalidate: ttl || DAY_IN_SECONDS },
    })
        .then((response) => {
            if (response.status >= 400) {
                throw Error(
                    `GraphQL query failed for query ${query.name} and ${args}`,
                )
            }
            return response.json()
        })
        .then((data) => {
            const value = data.data[query.name]
            if (!value) {
                throw Error(
                    `GraphQL query failed for query ${query.name} and ${args}`,
                )
            }
            return value as R
        })
