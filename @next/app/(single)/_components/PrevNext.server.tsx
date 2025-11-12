import { unstable_cache } from 'next/cache'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
/* Components */
import { PrevNext as Component } from '@app/(single)/_components/PrevNext'
/* Utils */
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
/* CONSTANTS */
import { VERSION } from '@sujin/common/constants/helper'
import { revalidate } from '@app/_lib/constants'
/* CONSTANTS */
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    type T_Post,
    type T_PrevNext,
} from '@app/_lib/types'
/* T_Types */
import type { T_Mongo } from '@sujin/common/types/mongo'

interface PostProps {
    slug: string
}

export const PrevNext = async ({ slug }: PostProps) => {
    const [prev, next] = await request(slug)
    if (!prev && !next) return <></>
    return <Component prev={prev} next={next} />
}

const request = async (slug: string) => {
    const request = unstable_cache(cached, [slug, VERSION], {
        tags: ['wordpress', 'post', 'prev-next'],
        revalidate,
    })
    return await request(slug)
}

/**
 * Fetches the recent posts from the cache or MongoDB.
 * This returns the cached result if it exists
 *
 * @param {string} slug - The id of the post
 * @returns {Promise<T_PrevNext[]>} A promise that resolves to the recent posts.
 */
const cached = async (slug: string): Promise<T_PrevNext[]> => {
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.POST, slug, 'prev-next'),
    )
    return await request(slug)
}

const query = async (_slug: string): Promise<T_PrevNext[]> => {
    const slug = sanitize(_slug)
    const post = await getCachedPost(slug)
    const _ids = post.archives
        .filter((archive) => archive.type === ARCHIVE.CATEGORY)
        .map((category) => new ObjectId(category._id))

    const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
    const prev = await collection
        .find({
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $lt: post.date },
            archives: { $in: _ids },
        })
        .sort({ date: -1 })
        .limit(1)
        .project<T_PrevNext>({
            _id: 0,
            title: 1,
            link: 1,
        })
        .toArray()
    const next = await collection
        .find({
            id: { $ne: post.id },
            status: POST_STATUS.PUBLISH,
            date: { $gt: post.date },
            archives: { $in: _ids },
        })
        .sort({ date: 1 })
        .limit(1)
        .project<T_PrevNext>({
            _id: 0,
            title: 1,
            link: 1,
        })
        .toArray()
    return [prev[0], next[0]]
}
