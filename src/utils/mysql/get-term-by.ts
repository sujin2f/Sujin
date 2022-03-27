import { CacheKeys, ErrorMessage, MySQLQuery, PER_PAGE } from 'src/constants'
import { Image, Nullable, Term } from 'src/types'
import { TermTypes } from 'src/types'
import { cached, mysql } from 'src/utils'
import { getPostsBy } from 'src/utils/mysql/get-posts-by'
import { getTermMeta } from 'src/utils/mysql/get-term-meta'
import { getAttachment } from 'src/utils/mysql/get-attachment'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 * @throws
 */
export const getTermBy = async (
    type: TermTypes,
    slug: string,
    page: number,
): Promise<Term> => {
    // Caching
    const cacheKey = `${CacheKeys.TERM}-${type}-${slug}-${page}`
    const cache = cached.get<Term | string>(cacheKey)
    if (cache && process.env.USE_CACHE) {
        if (typeof cache === 'string') {
            throw new Error(ErrorMessage.TERM_NOT_FOUND)
        }
        return cache
    }

    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const terms: Term[] = await connection
        .query(MySQLQuery.getTermBy('slug', slug))
        .catch(() => [])

    if (!terms.length) {
        cached.set<string>(cacheKey, 'NOT_FOUND')
        throw new Error(ErrorMessage.TERM_NOT_FOUND)
    }
    const result = terms[0]

    const pages = Math.ceil(result.total / PER_PAGE)
    const thumbnailId = await getTermMeta<{ value: string }>(
        result.id,
        'thumbnail',
    ).catch(() => undefined)
    let image: Nullable<Image>
    if (thumbnailId) {
        image = await getAttachment(parseInt(thumbnailId.value, 10)).catch(
            () => undefined,
        )
    }
    const term: Term = {
        ...result,
        type: TermTypes[result.type as keyof typeof TermTypes],
        limit: PER_PAGE,
        pages,
        image,
        posts: await getPostsBy(type, slug, page),
        page,
    }
    cached.set<Term>(cacheKey, term)
    return term
}
