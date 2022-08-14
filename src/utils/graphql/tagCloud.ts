import { MySQLQuery } from 'src/constants/mysql-query'
import { ErrorMessage } from 'src/constants/errors'
import { TagCloud } from 'src/types/wordpress'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

/**
 * Get all post meta
 *
 * @param {number} postId
 * @return {Promise<TagCloud[]>}
 */
export const tagCloud = async (): Promise<TagCloud[]> => {
    const cache = cached.get<TagCloud[]>('tag-cloud')
    if (cache && process.env.MYSQL_CACHE_TTL) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })

    let counts: number[] = []
    let hits: number[] = []
    const tags: Record<number, TagCloud> = await connection
        .query(MySQLQuery.getTagCount())
        .catch(() => [])
        .reduce((acc, item) => {
            const tag = item as TagCloud
            return {
                ...acc,
                [tag.id]: tag,
            }
        }, {})
    await connection
        .query(MySQLQuery.getTagHit())
        .catch(() => [])
        .each((item) => {
            const tag = item as TagCloud
            if (tags[tag.id]) {
                return
            }
            tags[tag.id] = tag
        })

    // Push counts and hits
    Object.keys(tags).forEach((key) => {
        const tag = tags[parseInt(key, 10)] as TagCloud
        counts.push(tag.count)
        hits.push(tag.hit)
    })

    counts = counts.sort((a, b) => a - b)
    hits = hits.sort((a, b) => a - b)

    const howManyItems = counts.length / 5
    const result = Object.values(tags).map((tag) => {
        const count = Math.ceil(counts.indexOf(tag.count) / howManyItems)
        const hit = Math.ceil(counts.indexOf(tag.count) / howManyItems)
        return {
            ...tag,
            count,
            hit,
        }
    })

    cached.set<TagCloud[]>('tag-cloud', result)
    return result
}
