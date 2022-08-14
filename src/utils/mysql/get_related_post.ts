import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { Post } from 'src/types/wordpress'
import { dateToPrettyUrl } from 'src/utils/common'
import { getPostImages } from 'src/utils/mysql/get-posts-by'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

export const getRelatedPost = async (post: Post): Promise<Post[]> => {
    const cacheKey = `${CacheKeys.RELATED}-${post.id}`
    const cache = cached.get<Post[]>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
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
            link: `/${dateToPrettyUrl(new Date(p.date))}/${p.slug}`,
            images: await getPostImages(p),
        })
    }

    cached.set<Post[]>(cacheKey, result)
    return result
}
