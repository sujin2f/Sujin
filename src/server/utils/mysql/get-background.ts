import { SQL_GET_TERM_ITEMS } from 'src/server/constants/query'
import { WP_KEYS } from 'src/server/constants/wp'
import { Background, Post } from 'src/types'
import { format } from 'src/utils/common'
import { getPostMeta } from './get-post-meta'
import { mysql } from './mysqld'

export const getBackground = async (): Promise<Background[]> => {
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
    return backgrounds
}
