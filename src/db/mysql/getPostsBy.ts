'use server'
/* Models */
import MySQL from '@src/db/mysql'
import Cached from '@common/model/Cached'
/* Constants */
import { MySQLQuery, PER_PAGE } from '@src/constants/mysql-query'
import { TermTypes } from '@src/constants/wordpress'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { VERSION } from '@common/constants/helper'
/* Utils */
import { autop } from '@src/utils/wordpress'
import { getPostMeta } from '@src/db/mysql/getPostMeta'
import { getTaxonomies } from '@src/db/mysql/getTaxonomies'
import { getMedia } from '@src/db/mysql/getMedia'
/* Types */
import type {
    Post,
    Term,
    ImageKeys,
    Image,
    PostType,
} from '@src/types/wordpress'
import type { Nullable } from '@common/types'

const getPostLink = (post: Post): string => {
    switch (post.type) {
        case 'post':
            return `/blog/${post.slug}`
        case 'page':
            return `/${post.slug}`
    }
    return post.link
}

const getPostQuery = (
    queryKey: TermTypes | 'id' | 'slug',
    type: PostType,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): string => {
    switch (queryKey) {
        case 'id':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy(
                      'posts.ID',
                      queryValue,
                      type,
                      0,
                      ignoreStatus,
                  )
        case 'slug':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy(
                      'posts.post_name',
                      queryValue,
                      type,
                      0,
                      ignoreStatus,
                  )
        // @deprecated
        case 'category':
        // @deprecated
        case 'tag':
            return !queryValue
                ? ''
                : MySQLQuery.getTermItems(
                      queryValue.toString(),
                      (page - 1) * PER_PAGE,
                  )
        // @deprecated
        case 'recent-posts':
            return MySQLQuery.getRecentPosts()
        case 'search':
            return !queryValue
                ? ''
                : MySQLQuery.getSearch(queryValue, (page - 1) * PER_PAGE)
    }

    return ''
}

type getPostImagesReturnType = {
    id: number
    list?: Image
    icon?: Image
    title?: Image
    background?: Image
    thumbnail?: Image
}
const getPostImages = async (post: Post): Promise<getPostImagesReturnType> => {
    const result: getPostImagesReturnType = {
        id: post.id,
    }

    const imageIds: Record<ImageKeys, number> = {
        list: await getPostMeta<number>(post.id, 'list', 0),
        icon: await getPostMeta<number>(post.id, 'icon', 0),
        title: await getPostMeta<number>(post.id, 'title', 0),
        background: await getPostMeta<number>(post.id, 'background', 0),
        thumbnail: await getPostMeta<number>(post.id, '_thumbnail_id', 0),
    }

    for (const imageKey of Object.keys(imageIds)) {
        if (!imageIds[imageKey as ImageKeys]) {
            continue
        }
        const image = await getMedia(imageIds[imageKey as ImageKeys])

        if (image) {
            result[imageKey as ImageKeys] = image
        }
    }

    return result
}

/**
 * @deprecated
 */
export const getAdjacentPost = async (
    post: Post,
    previous = true,
): Promise<Nullable<Post>> => {
    const query = MySQLQuery.getAdjacentPost(post, previous)
    const adjacentPost = await MySQL.getInstance()
        .selectOne<Post>(query)
        .catch(() => undefined)

    if (!adjacentPost) {
        return
    }

    return {
        ...adjacentPost,
        link: getPostLink(adjacentPost),
    }
}

/**
 * @deprecated
 */
export const getRelatedPost = async (post: Post): Promise<Post[]> => {
    const result: Post[] = []
    const tags = await MySQL.getInstance().select<Post>(
        MySQLQuery.getRelatedPost(
            'post_tag',
            post.tags.map((t) => t.id),
        ),
    )
    const categories = await MySQL.getInstance().select<Post>(
        MySQLQuery.getRelatedPost(
            'category',
            post.categories.map((t) => t.id),
        ),
    )

    const duplication: number[] = []
    const dbResult = [...tags, ...categories]
        .filter((r) => {
            if (r.id === post.id) {
                return false
            }
            if (duplication.includes(r.id)) {
                return false
            }
            duplication.push(r.id)
            return true
        })
        .slice(0, 4)

    for await (const post_ of dbResult) {
        result.push({
            ...post_,
            link: getPostLink(post_),
            images: await getPostImages(post_),
        })
    }

    return result
}

export const getPostsBy = async (
    queryKey: TermTypes | 'id' | 'slug',
    type: PostType,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<Post[]> => {
    const query = getPostQuery(queryKey, type, queryValue, page, ignoreStatus)
    const result = await MySQL.getInstance().select<Post>(query)

    // Create Post from dbResult
    const posts: Post[] = []
    for await (const post of result) {
        const link = getPostLink(post)
        const taxonomies: Term[] = await getTaxonomies(post.id)
        const meta = {
            useBackgroundColor: await getPostMeta<boolean>(
                post.id,
                'use-background-color',
                false,
            ).then((response) => !!response),
            backgroundColor: await getPostMeta<string>(
                post.id,
                'background-color',
                '',
            ),
        }
        const images = await getPostImages(post)
        const post_: Post = {
            ...post,
            content: autop(post.content),
            link,
            tags: taxonomies.filter((term) => term.type === TermTypes.post_tag),
            categories: taxonomies.filter(
                (term) => term.type === TermTypes.category,
            ),
            series: taxonomies.filter((term) => term.type === TermTypes.series),
            images,
            date: new Date(post.date).getTime(),
            meta,
        }

        const slug = post_.slug.toLowerCase()
        await Cached.getInstance().set(`${type}-${slug}-${VERSION}`, post_)

        posts.push(post_)
    }

    return posts
}

/**
 * Fetches the recent posts from the cache or executes the fetch if not cached.
 * It uses a caching mechanism to avoid fetching the posts multiple times within a day.
 *
 * @returns {Promise<Object>} A promise that resolves to the recent posts.
 *                             The structure of the posts depends on the implementation of `getPostsBy`.
 *
 * @throws {Error} Throws an error if the caching or fetching process fails.
 * @deprecated
 */
export const getRecentPosts = async () =>
    await Cached.getInstance().getOrExecute(
        'recent-post',
        async () => await getPostsBy(TermTypes.recent_posts, 'post'),
        DAY_IN_SECONDS,
    )
