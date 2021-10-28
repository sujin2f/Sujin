import { SQL_GET_TERM_ITEMS } from 'src/constants/query'
import { WP_KEYS } from 'src/constants/query'
import { Background, Post } from 'src/types'
import { format } from 'src/utils'
import { cached } from '../node-cache'
import { getPostMeta } from './get-post-meta'
import { mysql } from './mysqld'

/**
 * Get random backgrounds
 *
 * @return {Promise<Background[]>}
 */
export const getBackgrounds = async (): Promise<Background[]> => {
    const cache = cached.get<Background[]>('mysql-get-backgrounds')
    if (cache) {
        return cache
    }

    const connection = await mysql()
    const query = `${SQL_GET_TERM_ITEMS} ORDER BY RAND() LIMIT 10`
    const posts = await connection.query(format(query, 'background'))

    if (!posts.length) {
        return []
    }

    const backgrounds = []
    for (const item of posts) {
        const post = (item as unknown) as Post
        const result = await getPostMeta(post.id, WP_KEYS.ATTACHMENT_META)
        const meta = (result as unknown) as {
            sizes: { medium_large: { file: string } }
        }
        const mobile = meta.sizes.medium_large.file
        backgrounds.push({
            desktop: post.guid,
            mobile: post.guid.replace(/\/([0-9a-zA-Z-_\.]+)$/, `/${mobile}`),
        })
    }
    cached.set<Background[]>('mysql-get-backgrounds', backgrounds)
    return backgrounds
}
