import sanitize from 'mongo-sanitize'
/* Mongoose */
import { Page, Post } from '@src/schema/post'
/* Module */
import { DatabaseError } from '@sujin/share/model/Error'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Page, T_Post } from '@sujin/lib/types'

type Param = {
    slug: string
    type: 'page' | 'post'
}

/**
 * Get post
 * This returns the cached result if it exists
 *
 * @returns {Promise<T_Post | T_Page>} - The background array
 */
export const getPost = async (
    _: unknown,
    { slug: _slug, type: _type }: Param,
): Promise<T_Post | T_Page> => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)
    const request = cachedRequest(
        query,
        getCacheKey(COLLECTION.POST, slug, type),
    )

    const result = await request(slug, type)
    if (!result) {
        throw new DatabaseError('Post does not exist')
    }
    return result
}

const query = async (
    slug: string,
    type: 'page' | 'post',
): Promise<T_Post | T_Page | null> => {
    if (type === 'page') {
        return await Page.findOne({ slug, status: POST_STATUS.PUBLISH }).then(
            (result) => {
                if (!result) {
                    return null
                }
                return result.toObject() as T_Page
            },
        )
    }

    return await Post.aggregate<T_Post>([
        {
            $match: { status: POST_STATUS.PUBLISH, slug },
        },
        {
            $lookup: {
                from: COLLECTION.ARCHIVE,
                localField: 'archives',
                foreignField: '_id',
                as: 'archives',
                pipeline: [
                    {
                        $addFields: {
                            _id: { $toString: '$_id' },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                content: 0,
                meta: 0,
            },
        },
    ]).then((result) => {
        if (!result || !result.length) {
            return null
        }

        return result[0]
    })
}
