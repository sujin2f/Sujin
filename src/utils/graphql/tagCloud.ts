import { MySQLQuery } from 'src/constants/mysql-query'
import { TagCloud } from 'src/types/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'

/**
 * Get all post meta
 *
 * @param {number} postId
 * @return {Promise<TagCloud[]>}
 */
export const tagCloud = async (): Promise<TagCloud[]> => {
    let counts: number[] = []
    let hits: number[] = []
    const tags: Record<number, TagCloud> = (
        await MySQL.getInstance()
            .query<TagCloud[]>(MySQLQuery.getTagCount())
            .catch(() => [] as TagCloud[])
    ).reduce((acc, item: TagCloud) => {
        return {
            ...acc,
            [item.id]: item,
        }
    }, {})
    ;(
        await MySQL.getInstance()
            .query<TagCloud[]>(MySQLQuery.getTagHit())
            .catch(() => [] as TagCloud[])
    ).forEach((item: TagCloud) => {
        if (tags[item.id]) {
            return
        }
        tags[item.id] = item
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

    return result
}
