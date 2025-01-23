'use server'

import { Post } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Nullable } from '@common/types'

export const getPost = async (
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
