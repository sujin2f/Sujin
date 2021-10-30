import { MySQLQuery, CacheKeys, PostType } from 'src/constants'
import { PER_PAGE } from 'src/constants'
import { Post, GetPostsByArgs, TermTypes } from 'src/types'
import { dateToPrettyUrl, isDev, cached, mysql, getTaxonomies } from 'src/utils'

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

    const offset = (page - 1) * PER_PAGE
    const connection = await mysql()
    let result = []
    switch (key) {
        case 'id':
            result = await connection.query(
                MySQLQuery.getPostBy('posts.ID', value, offset),
            )
            break

        case 'slug':
            result = await connection.query(
                MySQLQuery.getPostBy('posts.post_name', value, offset),
            )
            break

        case 'category':
        case 'tag':
            result = await connection.query(
                MySQLQuery.getTermItems(value, offset),
            )
            break
    }

    if (!result.length) {
        return []
    }

    const posts: Post[] = []
    for await (const post of result) {
        let link = post.link
        switch (post.type) {
            case PostType.POST:
                link = `/${dateToPrettyUrl(new Date(post.date))}/${post.slug}`
                break

            case PostType.PAGE:
                link = `/${post.slug}`
                break
        }

        const taxonomies = await getTaxonomies(parseInt(post.id))

        posts.push({
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
            tags: taxonomies.filter((term) => term.type === TermTypes.post_tag),
            categories: taxonomies.filter(
                (term) => term.type === TermTypes.category,
            ),
            series: taxonomies.filter((term) => term.type === TermTypes.series),
        })
    }

    cached.set<Post[]>(`${CacheKeys.POST}-${key}-${value}`, posts)
    return posts
}
