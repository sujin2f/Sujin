import { useEffect, useState } from 'react'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Types */
import type { Nullable } from '@common/types'
import { T_Post } from '../types-post'

export const useRecentPost = (): Nullable<T_Post[]> => {
    const [posts, setPosts] = useState<Nullable<T_Post[]>>()
    useEffect(() => {
        fetchGQL(GQL.queryRecent, GQL.postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])
    return posts
}
