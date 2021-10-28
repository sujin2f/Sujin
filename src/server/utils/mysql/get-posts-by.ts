import { SQL_GET_POST_BY, SQL_GET_TERM_ITEMS } from 'src/constants/query'
import { Post } from 'src/types'
import { GetPostsByArgs } from 'src/types/graphql'
import { format } from 'src/utils'
import { dateToPrettyUrl } from 'src/utils/common'
import { cached } from '../node-cache'
import { mysql } from './mysqld'

/**
 * Get posts
 *
 * @param {GetPostsByArgs} { key, value }
 * @return {Promise<Post[]>}
 */
export const getPostsBy = async ({
    key,
    value,
    page = 1,
}: GetPostsByArgs): Promise<Post[]> => {
    const cache = cached.get<Post[]>(`mysql-get-posts-by-${key}-${value}`)
    if (cache) {
        return cache
    }

    const connection = await mysql()
    let result = []
    switch (key) {
        case 'id':
            result = await connection.query(
                format(SQL_GET_POST_BY, 'post.ID', value),
            )
            break

        case 'slug':
            result = await connection.query(
                format(SQL_GET_POST_BY, 'post.post_name', value),
            )
            break

        case 'category':
            result = await connection.query(format(SQL_GET_TERM_ITEMS, value))
            break
    }

    if (!result.length) {
        return []
    }

    // const baseUrl = new URL((await getOption<string>('home')) || '')
    const posts: Post[] = result.map((post: Record<string, string>) => {
        let link = post.link
        switch (post.type) {
            case 'post':
                link = `/${dateToPrettyUrl(new Date(post.date))}/${post.slug}`
                break
            case 'page':
                link = `/${post.slug}`
                break
        }

        return {
            id: parseInt(post.id),
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            date: post.date,
            link,
            parent: parseInt(post.parent),
            type: post.type,
            menuOrder: parseInt(post.menuOrder),
            tags: [],
        } as Post
    })

    cached.set<Post[]>(`mysql-get-posts-by-${key}-${value}`, posts)
    return posts
}
