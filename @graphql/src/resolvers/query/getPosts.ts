'use server'
import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { COLLECTION, type T_ArchivePost } from '@sujin/lib/types'
/* T_Types */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

type Param = {
    slug: string
    type: 'category' | 'tag'
    page: number
}

/**
 * Get archive
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Archive>} - The background array
 */
export const getArchivePosts = async (
    _: unknown,
    { slug: _slug, type: _type, page: _page }: Param,
): Promise<T_ArchivePost[]> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const page = sanitize(_page)

    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.ARCHIVE, slug, type, page),
    )

    return await request(slug, type, page)
}

const query = async (
    slug: string,
    type: string,
    page: number,
): Promise<T_ArchivePost[]> => {
    return []
}

//     const collection = await getCollection<T_Mongo<T_Post>>(COLLECTION.POST)
//     const match: Document = { archives: _id }
//     if (status) {
//         match.status = status
//     }

//     const posts = await collection
//         .aggregate<T_ArchivePost>([
//             {
//                 $match: match,
//             },
//             {
//                 $sort: { date: -1 },
//             },
//             ...getAggregation('paging', sanitize(page)),
//             ...getAggregation('expand-archive'),
//             ...getAggregation('to-archive-post'),
//         ])
//         .toArray()

//     if (!posts.length) {
//         throw new NoContentError(`Archive ${_id.toString()} is empty`)
//     }

//     return posts
// }
