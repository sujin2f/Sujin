import { MySQLQuery, ErrorMessage } from 'src/constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { TagCloud } from 'src/types'
import { cached, mysql } from 'src/utils'

/**
 * Get all post meta
 *
 * @param {number} postId
 * @return {Promise<TagCloud[]>}
 */
export const getTagCloud = async (): Promise<TagCloud[]> => {
    const cache = cached.get<TagCloud[]>('tag-cloud')
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })

    const tags: Record<number, TagCloud> = {}
    let counts: number[] = []
    let hits: number[] = []
    await connection
        .query(MySQLQuery.getTagCount())
        .catch(() => [])
        .map((item) => {
            const tag = item as TagCloud
            tags[tag.id] = tag
        })
    await connection
        .query(MySQLQuery.getTagHit())
        .catch(() => [])
        .map((item) => {
            const tag = item as TagCloud
            if (tags[tag.id]) {
                return
            }
            tags[tag.id] = tag
        })

    // Push counts and hits
    Object.keys(tags).map((key) => {
        const tag = tags[parseInt(key)] as TagCloud
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
