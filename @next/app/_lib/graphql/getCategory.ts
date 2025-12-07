'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import query from '@app/_lib/graphql/category.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_Archive } from '@sujin/lib/types'

export const getCategory = async (slug: string): Promise<T_Archive> => {
    return await gqlRequest(
        async () =>
            await client
                .query<{ category: T_Archive }>({
                    query,
                    variables: { slug },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) {
                        throw new Error(`🤬 Cannot find the category with ${slug}`)
                    }
                    return result.data.category
                }),
        `${COLLECTION.ARCHIVE}-category-${slug}`,
    )
}
