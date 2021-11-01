import { MySQLQuery, CacheKeys, PostType, ErrorMessage } from 'src/constants'
import { PER_PAGE } from 'src/constants'
import {
    Post,
    GetPostsByKeys,
    TermTypes,
    Nullable,
    Term,
    ImageKeys,
    Image,
} from 'src/types'
import {
    dateToPrettyUrl,
    cached,
    mysql,
    getTaxonomies,
    getPostMeta,
    getAttachment,
    autop,
} from 'src/utils'

type GetGraphPostsByArgs = {
    key: GetPostsByKeys
    value: string
    page: number
}

export const getGraphPostsBy = async ({
    key,
    value,
    page = 1,
}: GetGraphPostsByArgs): Promise<Nullable<Post[]>> => {
    return await getPostsBy(key, value, page).catch(() => {
        throw new Error()
    })
}

/**
 * Get posts by id/slug/category/tag
 *
 * @param {GetPostsByArgs} { key, value }
 * @return {Promise<Post[]>}
 * @throws
 */
export const getPostsBy = async (
    key: GetPostsByKeys,
    value: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<Nullable<Post[]>> => {
    // Caching
    const cacheKey = `${CacheKeys.POST}-${key}-${value}-${page}-${ignoreStatus}`
    const cache = cached.get<Post[]>(cacheKey)
    if (cache && process.env.USE_CACHE) {
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
            dbResult = await connection
                .query(MySQLQuery.getPostBy('posts.ID', value, 0, ignoreStatus))
                .catch(() => {
                    throw new Error(ErrorMessage.POST_NOT_FOUND)
                })
            break

        case 'slug':
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
            const offset = (page - 1) * PER_PAGE
            console.log(MySQLQuery.getTermItems(value.toString(), offset))
            dbResult = await connection
                .query(MySQLQuery.getTermItems(value.toString(), offset))
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
        const imageIds: Record<ImageKeys, number> = {
            list: await getPostMeta<number>(post.id, 'list').catch(() => 0),
            icon: await getPostMeta<number>(post.id, 'icon').catch(() => 0),
            title: await getPostMeta<number>(post.id, 'title').catch(() => 0),
            background: await getPostMeta<number>(post.id, 'background').catch(
                () => 0,
            ),
            thumbnail: await getPostMeta<number>(
                post.id,
                '_thumbnail_id',
            ).catch(() => 0),
        }

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

        const images: {
            [key in ImageKeys]?: Image
        } = {}

        for await (const key of Object.keys(imageIds)) {
            const imageKey = key as ImageKeys
            if (!imageIds[imageKey]) {
                continue
            }
            const image = await getAttachment(imageIds[imageKey]).catch(
                () => undefined,
            )

            if (image) {
                images[imageKey] = image
            }
        }

        posts.push({
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
        })
    }

    cached.set<Post[]>(cacheKey, posts)
    return posts
}
