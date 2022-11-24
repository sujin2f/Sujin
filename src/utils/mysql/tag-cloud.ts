import { MySQLQuery } from 'src/constants/mysql-query'
import { TagCloud, Term } from 'src/types/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { cached } from 'src/utils/node-cache'

const removeCache = (): void => {
    cached.del(MySQLQuery.getTagCount())
}

export const getTagCloud = async (): Promise<TagCloud[]> => {
    let counts: number[] = []
    let hits: number[] = []

    const mysql = await MySQL.getInstance()
    const tagResult = await mysql.query<TagCloud>(MySQLQuery.getTagCount(), [])
    const tags: Record<number, TagCloud> = tagResult.reduce(
        (acc, item: TagCloud) => {
            return {
                ...acc,
                [item.id]: item,
            }
        },
        {},
    )
    const hitResult = await mysql.query<TagCloud>(MySQLQuery.getTagHit(), [])
    hitResult.forEach((item: TagCloud) => {
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

    const itemCount = counts.length / 5
    return Object.values(tags).map((tag) => {
        const count = Math.ceil(counts.indexOf(tag.count) / itemCount)
        const hit = Math.ceil(counts.indexOf(tag.count) / itemCount)
        return {
            ...tag,
            count,
            hit,
        }
    })
}

export const updateHit = async (termId: number): Promise<void> => {
    const mysql = await MySQL.getInstance()
    await mysql.update(MySQLQuery.updateTagHit(termId))
    removeCache()
}
