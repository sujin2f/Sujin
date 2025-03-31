import type { TagCloud } from '@src/types/wordpress'
import { MySQLQuery } from '@src/constants/mysql-query'
import MySQL from '@src/db/mysql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import Cached from '@common/model/Cached'

export const request = async (): Promise<TagCloud[]> => {
    let counts: number[] = []
    let hits: number[] = []

    const mysql = await MySQL.getInstance()
    const tagResult = await mysql.select<TagCloud>(MySQLQuery.getTagCount(), [])
    const tags: Record<number, TagCloud> = tagResult.reduce(
        (acc, item: TagCloud) => {
            return {
                ...acc,
                [item.id]: item,
            }
        },
        {},
    )
    const hitResult = await mysql.select<TagCloud>(MySQLQuery.getTagHit(), [])
    hitResult.forEach((item: TagCloud) => {
        if (tags[item.id]) {
            return
        }
        tags[item.id] = item
    })

    // Push counts and hits
    Object.keys(tags).forEach((key) => {
        const tag = tags[parseInt(key)] as TagCloud
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

export const updateHit = (termId: number) => {
    MySQL.getInstance().update(MySQLQuery.updateTagHit(termId))
}

export const getTagCloud = async () =>
    await Cached.getInstance().getOrExecute(
        'tag-cloud',
        async () => await request(),
        WEEK_IN_SECONDS,
    )
