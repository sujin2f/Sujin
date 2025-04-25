import { DAY_IN_SECONDS } from '@common/constants/datetime'
import type { IQuery, ScalarJSType } from '.'
import { VERSION } from '../../constants/helper'
import { FetchError } from '../../model/Error'

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
                throw new FetchError(
                    `GraphQL query failed for query ${query.name} and ${args} with response of ${response.status}`,
                )
            }
            return response.json()
        })
        .then((data) => {
            const value = data.data[query.name]
            if (!value) {
                throw new FetchError(
                    `GraphQL query failed for query ${query.name} and ${args} due to an empty value`,
                )
            }
            return value as R
        })
