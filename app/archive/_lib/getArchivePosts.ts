'use server'
import type { ObjectId, Document } from 'mongodb'
/* Models */
import { NoContentError } from '@common/model/Error'
/* Utils */
import { getCollection } from '@common/data/mongo/mongo'
import { getAggregation } from '@app/_lib/utils/server'
/* CONSTANTS */
import {
    POST_STATUS,
    COLLECTION,
    type T_Post,
    type T_ArchivePost,
} from '@app/_lib/types'
/* T_Types */
import type { T_Mongo } from '@common/types/mongo'

export const getArchivePosts = async (
    _id: ObjectId,
    page: number,
    status?: POST_STATUS,
) => {
    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
    const match: Document = { archives: _id }
    if (status) {
        match.status = status
    }

    const posts = await collection
        .aggregate<T_ArchivePost>([
            {
                $match: match,
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

    if (!posts.length) {
        throw new NoContentError(`Archive ${_id.toString()} is empty`)
    }

    return posts
}
