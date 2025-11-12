import { GraphQLError } from 'graphql'
import { Document } from 'mongoose'
import sanitize from 'mongo-sanitize'
/* Mongoose */
import { Page, Post } from '@src/schema/post'
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

    return await request(slug, type)
}

const query = async (
    slug: string,
    type: 'page' | 'post',
): Promise<T_Post | T_Page> => {
    if (type === 'page') {
        return await Page.findOne<Document<string, unknown, T_Page>>({
            slug,
            status: POST_STATUS.PUBLISH,
        }).then((result) => {
            if (!result) {
                throw new GraphQLError(`Cannot find the page ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }

            return result.toObject()
        })
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
            throw new GraphQLError(`Cannot find the post ${slug}`, {
                extensions: {
                    code: 'NO_CONTENT',
                },
            })
        }

        return result[0]
    })
}
