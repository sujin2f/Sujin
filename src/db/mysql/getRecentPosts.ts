'use server'

import { Term, TermTypes } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'

const cachedRequest = async () => {
    return unstable_cache(
        async (): Promise<Term> => ({
            id: 1,
            title: 'recent',
            slug: 'recent',
            type: TermTypes.recent_posts,
            total: 1,
            limit: 1,
            pages: 1,
            page: 1,
            posts: (await getPostsBy(TermTypes.recent_posts)) || [],
            excerpt: 'recent',
        }),
        ['recent'],
        { revalidate: DAY_IN_SECONDS },
    )
}

export const getRecentPosts = async () =>
    await (
        await cachedRequest()
    )()
        .then((result) => result)
        .catch((e) => {
            throw new Error(e.message)
        })
