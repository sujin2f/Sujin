import Mongo from '@common/data/mongo/mongo'
import { getCachedData } from '@src/db/mongo/object-cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { getTermBy as queryTerm } from '@src/db/mysql/getTermBy'
import { Term, TermTypes } from '@src/types/wordpress'
import type { Filter } from 'mongodb'
import { getPost } from '@src/db/mongo/wordpress/post'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (doc: Filter<Term>): Promise<void> => {
    const { type, slug, page } = doc as {
        slug: string
        type: TermTypes
        page: number
    }
    const term = await queryTerm(type, slug, page)
    if (!term) {
        return
    }
    // Update posts
    term.posts.forEach((post) => {
        getPost(post.slug)
    })
    await Mongo.deleteMany('term', { type, slug, page })
    await Mongo.insertMany('term', [term])
}

export const getTerm = async (type: TermTypes, slug: string, page: number) =>
    (
        await getCachedData<Term>(
            'term',
            { type, slug: slug.toLowerCase(), page },
            requestAPI,
            DAY_IN_SECONDS,
        )
    )[0]
