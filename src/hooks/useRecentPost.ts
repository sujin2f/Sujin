import { useEffect, useState } from 'react'
/* Helpers */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryRecent } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { Post } from '@src/types/wordpress'
import type { Nullable } from '@common/types'

export const useRecentPost = (): Nullable<Post[]> => {
    const [posts, setPosts] = useState<Nullable<Post[]>>()
    useEffect(() => {
        fetchGQL(queryRecent, postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])
    return posts
}
