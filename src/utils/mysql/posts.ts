import { MySQLQuery, PER_PAGE } from 'src/constants/mysql-query'
import { PostType } from 'src/constants/wp'
import { Post, Term, ImageKeys, Image, TermTypes } from 'src/types/wordpress'
import { Nullable } from 'src/types/common'
import { dateToPrettyUrl } from 'src/utils/common'
import { autop } from 'src/utils/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { getPostMeta } from 'src/utils/mysql/post-meta'
import { getTaxonomies } from 'src/utils/mysql/term'
import { getMedia } from 'src/utils/mysql/media'

const getPostLink = (post: Post): string => {
    switch (post.type) {
        case PostType.POST:
            return `/${dateToPrettyUrl(new Date(post.date))}/${post.slug}`
        case PostType.PAGE:
            return `/${post.slug}`
    }
    return post.link
}

const getPostQuery = (
    queryKey: TermTypes | 'id' | 'slug',
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): string => {
    switch (queryKey) {
        case 'id':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy('posts.ID', queryValue, 0, ignoreStatus)
        case 'slug':
            return !queryValue
                ? ''
                : MySQLQuery.getPostBy(
                      'posts.post_name',
                      queryValue,
                      0,
                      ignoreStatus,
                  )
        case 'category':
        case 'tag':
            return !queryValue
                ? ''
                : MySQLQuery.getTermItems(
                      queryValue.toString(),
                      (page - 1) * PER_PAGE,
                  )
        case 'recent-posts':
            return MySQLQuery.getRecentPosts()
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

const getAdjacentPost = async (
    post: Post,
    previous = true,
): Promise<Nullable<Post>> => {
    const query = MySQLQuery.getAdjacentPost(post, previous)
    const adjacentPost = await MySQL.getInstance().selectOne<Post>(query)

    if (!adjacentPost) {
        return
    }

    return {
        ...adjacentPost,
        link: getPostLink(adjacentPost),
    }
}

const getRelatedPost = async (post: Post): Promise<Post[]> => {
    const result = []
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
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<Post[]> => {
    const query = getPostQuery(queryKey, queryValue, page, ignoreStatus)
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
            meta,
            prevNext: {},
            related: [],
        }
        if (post_.type === 'post') {
            post_.prevNext = {
                prev: await getAdjacentPost(post_, true),
                next: await getAdjacentPost(post_, false),
            }
            post_.related = await getRelatedPost(post_)
        }

        posts.push(post_)
    }

    return posts
}

export const getPost = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    ignoreStatus = false,
): Promise<Nullable<Post>> => {
    const posts = await getPostsBy(queryKey, queryValue, 1, ignoreStatus)

    if (posts.length) {
        return posts[0]
    }

    return
}
