'use server'

import { unstable_cache } from 'next/cache'

import { Post } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Error } from '@common/model/Error'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { Nullable } from '@common/types'
import { updateHit } from '@src/db/mysql/getTagCloud'

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

const cachedRequest = async (slug: string) =>
    unstable_cache(
        async () =>
            await request('slug', slug).then((post) => {
                if (!post) {
                    throw new Error(`Post ${slug} does not exist.`, {
                        level: 'error',
                    })
                }
                return post
            }),
        ['post', slug],
        { revalidate: DAY_IN_SECONDS * 7 },
    )()

export const getPost = async (slug: string, updateTagCloud = false) => {
    if (!slug) {
        throw new Error('getPost(), The slug is empty')
    }

    const post = await cachedRequest(slug)

    // Update Tag Cloud
    if (updateTagCloud && post.tags.length) {
        post.tags.forEach((tag) => updateHit(tag.id))
    }

    return post
}
