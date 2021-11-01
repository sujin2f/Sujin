import { CacheKeys, ErrorMessage, MySQLQuery, PER_PAGE } from 'src/constants'
import type { GetTermByArgs, Image, Nullable, Term } from 'src/types'
import { TermTypes } from 'src/types'
import { cached, getAttachment, getTermMeta, mysql } from 'src/utils'

/**
 * Get Term from ID
 *
 * @param {number} termId
 * @return {Promise<Nullable<Term>}
 * @throws
 */
export const getTermBy = async ({
    key,
    value,
}: GetTermByArgs): Promise<Term> => {
    // Caching
    const cacheKey = `${CacheKeys.TERM}-${key}-${value}`
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
    const result: Term[] = await connection
        .query(MySQLQuery.getTermBy(key, value.toString()))
        .catch(() => [])

    if (!result.length) {
        cached.set<string>(cacheKey, 'NOT_FOUND')
        throw new Error(ErrorMessage.TERM_NOT_FOUND)
    }

    const pages = Math.ceil(result[0].total / PER_PAGE)
    const thumbnailId = await getTermMeta<{ value: string }>(
        result[0].id,
        'thumbnail',
    ).catch(() => undefined)
    let image: Nullable<Image> = undefined
    if (thumbnailId) {
        image = await getAttachment(parseInt(thumbnailId.value)).catch(
            () => undefined,
        )
    }
    const term: Term = {
        ...result[0],
        type: TermTypes[result[0].type as keyof typeof TermTypes],
        limit: PER_PAGE,
        pages,
        image,
    }
    cached.set<Term>(cacheKey, term)
    return term
}
