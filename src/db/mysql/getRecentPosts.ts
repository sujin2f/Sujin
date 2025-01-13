'use server'

import { cache } from 'react'
import { TermTypes } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'

export const getRecentPosts = cache(
    async () => (await getPostsBy(TermTypes.recent_posts)) || [],
)
