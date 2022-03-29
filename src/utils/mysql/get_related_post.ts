import { CacheKeys, ErrorMessage, MySQLQuery } from 'src/constants'
import { Post } from 'src/types'
import { dateToPrettyUrl } from '../common'
import { cached } from '../node-cache'
import { getPostImages } from './get-posts-by'
import { mysql } from './mysqld'

export const getRelatedPost = async (post: Post): Promise<Post[]> => {
    const cacheKey = `${CacheKeys.RELATED}-${post.id}`
    const cache = cached.get<Post[]>(cacheKey)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })

    const dbResultTag = await connection
        .query(
            MySQLQuery.getRelatedPost(
                'post_tag',
                post.tags.map((t) => t.id),
            ),
        )
        .catch(() => undefined)
    const dbResultCategory = await connection
        .query(
            MySQLQuery.getRelatedPost(
                'category',
                post.categories.map((t) => t.id),
            ),
        )
        .catch(() => undefined)
    const removingIds: number[] = []
    const dbResult = [...dbResultTag, ...dbResultCategory]
        .filter((r) => {
            if (removingIds.includes(r.id)) {
                return false
            }
            removingIds.push(r.id)
            return true
        })
        .slice(0, 4)

    if (!dbResult.length) {
        cached.set<Post[]>(cacheKey, [])
        return []
    }

    const result = []
    for await (const p of dbResult) {
        result.push({
            ...p,
            link: `/${dateToPrettyUrl(new Date(dbResult[0].date))}/${
                dbResult[0].slug
            }`,
            images: await getPostImages(p),
        })
    }

    cached.set<Post[]>(cacheKey, result)
    return result
}
