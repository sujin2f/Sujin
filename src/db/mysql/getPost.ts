'use server'

import { Post } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { unstable_cache } from 'next/cache'
import { Error } from '@common/model/Error'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { Nullable } from '@common/types'

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
        { revalidate: DAY_IN_SECONDS * 7 },
    )
}

export const getPost = async (slug: string) => {
    if (!slug) {
        throw new Error('The slug is empty to call getPost')
    }

    return await (
        await cachedRequest(slug)
    )()
}
