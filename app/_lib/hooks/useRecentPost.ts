import { useEffect, useState } from 'react'
/* Helpers */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { PostType } from '@app/_lib/data/mysql/types'
import type { Nullable } from '@common/types'

export const useRecentPost = (): Nullable<PostType[]> => {
    const [posts, setPosts] = useState<Nullable<PostType[]>>()
    useEffect(() => {
        fetchGQL(GQL.queryRecent, GQL.postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])
    return posts
}
