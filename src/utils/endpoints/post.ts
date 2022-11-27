import { PostVariables } from 'src/constants/graphql'
import { Post } from 'src/types/wordpress'
import { getPost } from 'src/utils/mysql/posts'
import { updateHit } from 'src/utils/mysql/tag-cloud'
import { Cached } from 'src/utils/node-cache'
import { MySQL } from 'src/utils/mysql/mysqld'
import { MySQLQuery } from 'src/constants/mysql-query'

export const post = async ({ slug }: PostVariables): Promise<Post> => {
    const cacheKey = `post ${slug}`
    const cache = Cached.getInstance()

    const mysql = MySQL.getInstance()
    const isUpdated = await mysql.selectOne<boolean>(
        MySQLQuery.getPostMeta(1, `${slug}-updated`),
    )
    if (isUpdated) {
        cache.del(cacheKey)
        mysql.update(MySQLQuery.deletePostMeta(1, `${slug}-updated`))
    }

    const post = await cache.getOrExecute<Post>(cacheKey, async () => {
        return await getPost('slug', slug)
    })

    if (!cache.isFailed(post)) {
        post.tags.forEach((tag) => {
            void updateHit(tag.id)
        })
        return post
    }
    console.error(`🤬 Post does not exist: ${slug}`)
    throw new Error(`🤬 Post does not exist: ${slug}`)
}
