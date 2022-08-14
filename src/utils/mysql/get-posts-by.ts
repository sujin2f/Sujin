import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery, PER_PAGE } from 'src/constants/mysql-query'
import { PostType } from 'src/constants/wp'
import { Post, Term, ImageKeys, Image, TermTypes } from 'src/types/wordpress'
import { dateToPrettyUrl } from 'src/utils/common'
import { autop } from 'src/utils/wp-content'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'
import { getPostMeta } from 'src/utils/mysql/get-post-meta'
import { getTaxonomies } from 'src/utils/mysql/get-taxonomies'
import { getAttachment } from 'src/utils/mysql/get-attachment'
import { getAdjacentPost } from './get_adjacent_post'
import { getRelatedPost } from './get_related_post'

export const getPostImages = async (post: Post) => {
    const imageIds: Record<ImageKeys, number> = {
        list: await getPostMeta<number>(post.id, 'list').catch(() => 0),
        icon: await getPostMeta<number>(post.id, 'icon').catch(() => 0),
        title: await getPostMeta<number>(post.id, 'title').catch(() => 0),
        background: await getPostMeta<number>(post.id, 'background').catch(
            () => 0,
        ),
        thumbnail: await getPostMeta<number>(post.id, '_thumbnail_id').catch(
            () => 0,
        ),
    }

    const images: {
        [imageKey in ImageKeys]?: Image
    } = {}

    for await (const imageKey of Object.keys(imageIds)) {
        if (!imageIds[imageKey as ImageKeys]) {
            continue
        }
        const image = await getAttachment(
            imageIds[imageKey as ImageKeys],
        ).catch(() => undefined)

        if (image) {
            images[imageKey as ImageKeys] = image
        }
    }
    return {
        id: post.id,
        ...images,
    }
}
/**
 * Get posts by id/slug/category/tag
 *
 * @param {GetPostsByArgs} { key, value }
 * @return {Promise<Post[]>}
 * @throws
 */
export const getPostsBy = async (
    key: TermTypes | 'id' | 'slug',
    value?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<Post[]> => {
    // Caching
    const cacheKey = `${CacheKeys.POST}-${key}-${value}-${page}-${ignoreStatus}`
    const cache = cached.get<Post[]>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        if (cache === []) {
            throw new Error(ErrorMessage.POST_NOT_FOUND)
        }
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })

    // MySQL query
    let dbResult: Post[] = []
    switch (key) {
        case 'id':
            if (!value) {
                return []
            }
            dbResult = await connection
                .query(MySQLQuery.getPostBy('posts.ID', value, 0, ignoreStatus))
                .catch(() => {
                    throw new Error(ErrorMessage.POST_NOT_FOUND)
                })
            break

        case 'slug':
            if (!value) {
                return []
            }
            dbResult = await connection
                .query(
                    MySQLQuery.getPostBy(
                        'posts.post_name',
                        value,
                        0,
                        ignoreStatus,
                    ),
                )
                .catch(() => {
                    throw new Error(ErrorMessage.POST_NOT_FOUND)
                })
            break

        case 'category':
        case 'tag':
            if (!value) {
                return []
            }
            const offset = (page - 1) * PER_PAGE
            dbResult = await connection
                .query(MySQLQuery.getTermItems(value.toString(), offset))
                .catch(() => {
                    throw new Error(ErrorMessage.POST_NOT_FOUND)
                })
            break
        case 'recent-posts':
            dbResult = await connection
                .query(MySQLQuery.getRecentPosts())
                .catch(() => {
                    throw new Error(ErrorMessage.POST_NOT_FOUND)
                })
            break
    }

    if (!dbResult.length) {
        cached.set<Post[]>(cacheKey, [])
        throw new Error(ErrorMessage.POST_NOT_FOUND)
    }

    // Create Post from dbResult
    const posts: Post[] = []
    for await (const post of dbResult) {
        let link = post.link
        switch (post.type) {
            case PostType.POST:
                link = `/${dateToPrettyUrl(new Date(post.date))}/${post.slug}`
                break

            case PostType.PAGE:
                link = `/${post.slug}`
                break
        }

        const taxonomies = await getTaxonomies(post.id).catch(
            () => [] as Term[],
        )

        const meta = {
            useBackgroundColor: await getPostMeta<boolean>(
                post.id,
                'use-background-color',
            )
                .then(() => true)
                .catch(() => false),
            backgroundColor: await getPostMeta<string>(
                post.id,
                'background-color',
            ).catch(() => ''),
        }

        const images = await getPostImages(post)

        const postResult = {
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: autop(post.content),
            date: post.date,
            link,
            parent: post.parent,
            type: post.type,
            menuOrder: post.menuOrder,
            tags: taxonomies.filter((term) => term.type === TermTypes.post_tag),
            categories: taxonomies.filter(
                (term) => term.type === TermTypes.category,
            ),
            series: taxonomies.filter((term) => term.type === TermTypes.series),
            mimeType: post.mimeType,
            images,
            meta,
            prevNext: {},
            related: [] as Post[],
        }

        if (postResult.type === 'post') {
            postResult.prevNext = {
                prev: await getAdjacentPost(postResult, true),
                next: await getAdjacentPost(postResult, false),
            }
            postResult.related = await getRelatedPost(postResult)
        }

        posts.push(postResult)
    }

    cached.set<Post[]>(cacheKey, posts)
    return posts
}

export const getPost = async (slug: string): Promise<Post> => {
    const posts = await getPostsBy('slug', slug)
    if (posts) {
        return posts[0]
    }
    throw new Error('')
}
