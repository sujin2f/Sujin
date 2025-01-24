import Mongo from '@common/data/mongo/mongo'
import { SECOND_IN_MS, WEEK_IN_SECONDS } from '@common/constants/datetime'
import { getTermBy as queryTerm } from '@src/db/mysql/getTermBy'
import { Term, TermTypes } from '@src/types/wordpress'
import { getPost } from '@src/db/mongo/wordpress/post'
import type { WithCache } from '@src/db/mongo/util'

/**
 * Requests MySQL and save
 *
 * @returns {Promise<void>}
 */
const requestAPI = async (
    type: TermTypes,
    slug: string,
    page: number,
    action: 'insert' | 'replace',
): Promise<Term | undefined> =>
    queryTerm(type, slug, page).then((result) => {
        if (result) {
            const doc = {
                ...result,
                expired: Date.now() / SECOND_IN_MS + WEEK_IN_SECONDS,
            }

            if (action === 'insert') {
                Mongo.insertOne('term', doc)
            } else {
                Mongo.replaceOne('term', { slug }, doc)
            }

            result.posts.forEach((post) => {
                getPost(post.slug)
            })
        }

        return result
    })

export const getTerm = async (type: TermTypes, _slug: string, page: number) => {
    const slug = _slug.toLowerCase()
    const term = await Mongo.findOne<WithCache<Term>>('term', {
        type,
        slug,
        page,
    }).catch(() => null)

    // Term is not found
    if (!term) {
        return await requestAPI(type, slug, page, 'insert')
    }

    // Check if the cache is not expired
    if (term.expired > Date.now() / SECOND_IN_MS) {
        return term
    }

    // If the cache is expired, update the cache
    requestAPI(type, slug, page, 'replace')
    return term
}
