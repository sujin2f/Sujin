import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { Nullable } from 'src/types/common'
import { Post } from 'src/types/wordpress'
import { dateToPrettyUrl } from 'src/utils/common'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'

export const getAdjacentPost = async (
    post: Post,
    previous = true,
): Promise<Nullable<Post>> => {
    const cacheKey = `${CacheKeys.ADJACENT}-${post.id}-${previous}`
    const cache = cached.get<Nullable<Post>>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })

    const dbResult = await connection
        .query(MySQLQuery.getAdjacentPost(post, previous))
        .catch(() => undefined)

    if (!dbResult.length) {
        cached.set<Nullable<Post>>(cacheKey, undefined)
        return
    }

    const result = {
        ...dbResult[0],
        link: `/${dateToPrettyUrl(new Date(dbResult[0].date))}/${
            dbResult[0].slug
        }`,
    }

    cached.set<Nullable<Post>>(cacheKey, result)
    return result
}
