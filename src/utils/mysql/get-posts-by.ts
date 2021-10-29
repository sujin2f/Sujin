import { MySQLQuery, CacheKeys, PostType } from 'src/constants'
import { Post, GetPostsByArgs } from 'src/types'
import { dateToPrettyUrl, isDev, cached, mysql } from 'src/utils'

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
    const cache = cached.get<Post[]>(`${CacheKeys.POST}-${key}-${value}`)

    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    let result = []
    switch (key) {
        case 'id':
            result = await connection.query(
                MySQLQuery.getPostBy('post.ID', value),
            )
            break

        case 'slug':
            result = await connection.query(
                MySQLQuery.getPostBy('post.post_name', value),
            )
            break

        case 'category':
            result = await connection.query(MySQLQuery.getTermItems(value))
            break
    }

    if (!result.length) {
        return []
    }

    // const baseUrl = new URL((await getOption<string>('home')) || '')
    const posts: Post[] = result.map((post: Record<string, string>) => {
        let link = post.link
        switch (post.type) {
            case PostType.POST:
                link = `/${dateToPrettyUrl(new Date(post.date))}/${post.slug}`
                break

            case PostType.PAGE:
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

    cached.set<Post[]>(`${CacheKeys.POST}-${key}-${value}`, posts)
    return posts
}
