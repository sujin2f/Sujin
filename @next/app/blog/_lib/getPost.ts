'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import query from '@app/blog/_lib/getPost-gql.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

export const getPost = async (slug: string): Promise<T_Post> => {
    return await gqlRequest<T_Post>(
        async () =>
            await client
                .query<{ post: T_Post }>({
                    query,
                    variables: { slug },
                    fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
                })
                .then((result) => {
                    if (!result.data) {
                        throw new Error(`🤬 Cannot find the post with slug ${slug}`)
                    }
                    return result.data.post
                }),
        `${COLLECTION.POST}-${slug}`,
    )
}
