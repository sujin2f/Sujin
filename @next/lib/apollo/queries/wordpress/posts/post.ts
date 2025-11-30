'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/posts/post.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_Post } from '@sujin/lib/types'

export const post = async (slug: string): Promise<T_Post> => {
    return await client
        .query<{ post: T_Post }>({
            query: QUERY,
            variables: { slug },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                throw new Error(`🤬 Cannot find the post with slug ${slug}`)
            }
            return result.data.post
        })
}
