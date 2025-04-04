import { useEffect, useState } from 'react'
/* Helpers */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import GQL from '@app/helpers/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { PostType } from '@app/helpers/types/wordpress'
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
