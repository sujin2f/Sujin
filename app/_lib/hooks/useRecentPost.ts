import { useEffect, useState } from 'react'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* T_Types */
import type { Nullable } from '@common/types'
import type { T_PostArchive } from '@app/_lib/types'

export const useRecentPost = (): Nullable<T_PostArchive[]> => {
    const [posts, setPosts] = useState<Nullable<T_PostArchive[]>>()
    useEffect(() => {
        fetchGQL(GQL.queryRecent, GQL.postOpr, WEEK_IN_SECONDS)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [])
    return posts
}
