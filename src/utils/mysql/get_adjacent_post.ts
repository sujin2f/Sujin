import { CacheKeys, ErrorMessage, MySQLQuery } from 'src/constants'
import { Nullable, Post } from 'src/types'
import { dateToPrettyUrl } from '../common'
import { cached } from '../node-cache'
import { mysql } from './mysqld'

export const getAdjacentPost = async (
    post: Post,
    previous = true,
): Promise<Nullable<Post>> => {
    const cacheKey = `${CacheKeys.ADJACENT}-${post.id}-${previous}`
    const cache = cached.get<Nullable<Post>>(cacheKey)
    if (cache && process.env.USE_CACHE) {
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
