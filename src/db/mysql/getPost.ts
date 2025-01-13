'use server'

import { Post } from '@src/types/wordpress'
import { Nullable } from '@common/types'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { unstable_cache } from 'next/cache'

export const request = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    ignoreStatus = false,
): Promise<Nullable<Post>> => {
    const posts = await getPostsBy(queryKey, queryValue, 1, ignoreStatus)

    if (posts.length) {
        return posts[0]
    }

    return
}

const cachedRequest = async (slug: string) => {
    return unstable_cache(
        async () => await request('slug', slug),
        ['post', slug],
    )
}

export const getPost = async (slug: string) => {
    return (await (
        await cachedRequest(slug)
    )()) as Post
}
