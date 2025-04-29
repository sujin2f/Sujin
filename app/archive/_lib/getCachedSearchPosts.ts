'use server'
import sanitize from 'mongo-sanitize'
/* Models */
import { NoContentError } from '@common/model/Error'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
import { cachedRequest } from '@app/_lib/utils/cache'
/* CONSTANTS */
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_ArchivePost,
    type PropWithPages,
} from '@app/_lib/types'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

export const getCachedSearchPosts = async (
    _text: string,
    _page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const text = sanitize(_text)
    const page = sanitize(_page)
    let error: Error | null = null

    const search = await cachedRequest(
        COLLECTION.ARCHIVE,
        ['search', text, page],
        async () => {
            const doc = {
                $text: { $search: text },
                status: POST_STATUS.PUBLISH,
            }

            const collection = await getCollection<T_Mongo<T_Post>>(
                COLLECTION.POST,
            )
            const total = await collection.countDocuments(doc)
            const list = await collection
                .aggregate<T_ArchivePost>([
                    {
                        $match: doc,
                    },
                    {
                        $sort: { date: -1 },
                    },
                    ...getAggregation('paging', page),
                    ...getAggregation('_id'),
                    ...getAggregation('expand-archive'),
                    ...getAggregation('to-archive-post'),
                ])
                .toArray()

            // Failed to find the post, cache false
            if (!list.length) {
                error = new NoContentError(`Search result ${text} is empty`)
                return false
            }

            return {
                list,
                pages: Math.ceil(total / PER_PAGE),
            } satisfies PropWithPages<T_ArchivePost>
        },
    )

    if (error) {
        throw error
    }

    return search as PropWithPages<T_ArchivePost>
}
