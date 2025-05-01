/* Models */
import MySQL from '@app/_lib/data/mysql'
import { FetchError } from '@common/model/Error'
/* CONSTANTS */
import { MySQLQuery, PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    ARCHIVE,
    TAXONOMY,
    type POST_TYPE,
    type T_Archive,
    type T_MySQLPost,
} from '@app/_lib/types'
/* Utils */
import { autop } from '@app/_lib/data/mysql/utils'
import { unserialize } from '@app/_lib/data/mysql/utils'
/* T_Types */
import { type POST_IMAGE_LOCATION, type T_ImageBlock } from '@app/_lib/types'
import { getMedia } from './getMedia'

type T_PostMeta = {
    meta_key: string
    meta_value: string
}

export const getPostMeta = async <
    T extends Record<string, unknown> | string | number | boolean,
>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const mysql = MySQL.getInstance()
    const value = await mysql
        .select<T_PostMeta>(MySQLQuery.getPostMeta(postId, metaKey))
        .then((value) => value[0])
        .catch(() => undefined)

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}

export const getPostBy = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    type: POST_TYPE,
    ignoreStatus = false,
): Promise<T_MySQLPost> => {
    return await getPostsBy(queryKey, type, queryValue, 1, ignoreStatus).then(
        (result) => {
            if (!result[0])
                throw new FetchError(
                    `Failed to find MySQL post with: ${queryKey}, ${queryValue}, and ${type}`,
                )
            return result[0]
        },
    )
}

const getPostQuery = (
    queryKey: 'search' | 'id' | 'slug' | ARCHIVE,
    type: POST_TYPE,
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
        case 'search':
            return !queryValue
                ? ''
                : MySQLQuery.getSearch(queryValue, (page - 1) * PER_PAGE)

        case ARCHIVE.CATEGORY:
        case ARCHIVE.TAG:
            return !queryValue
                ? ''
                : MySQLQuery.getTermItems(
                      queryValue.toString(),
                      (page - 1) * PER_PAGE,
                      ignoreStatus,
                  )
    }
}

export const getPostsBy = async (
    queryKey: 'search' | 'id' | 'slug' | ARCHIVE,
    type: POST_TYPE,
    queryValue?: string | number,
    page = 1,
    ignoreStatus = false,
): Promise<T_MySQLPost[]> => {
    const query = getPostQuery(queryKey, type, queryValue, page, ignoreStatus)
    const result = await MySQL.getInstance().select<T_MySQLPost>(query)

    // Create Post from dbResult
    const posts: T_MySQLPost[] = []
    for await (const post of result) {
        const terms: T_Archive[] = await getTermsByPost(post.id)
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

        posts.push({
            ...post,
            images,
            meta,
            content: autop(post.content),
            terms: terms.map((term) =>
                term.type.toString() === TAXONOMY.POST_TAG
                    ? { ...term, type: TAXONOMY.TAG }
                    : term,
            ),
            link: post.type === 'page' ? `/${post.slug}` : `/blog/${post.slug}`,
        })
    }

    return posts
}

type getPostImagesReturnType = {
    list?: T_ImageBlock
    icon?: T_ImageBlock
    title?: T_ImageBlock
    background?: T_ImageBlock
    thumbnail?: T_ImageBlock
}
const getPostImages = async (
    post: T_MySQLPost,
): Promise<getPostImagesReturnType> => {
    const result: getPostImagesReturnType = {}

    const imageIds: Record<POST_IMAGE_LOCATION, number> = {
        list: await getPostMeta<number>(post.id, 'list', 0),
        icon: await getPostMeta<number>(post.id, 'icon', 0),
        title: await getPostMeta<number>(post.id, 'title', 0),
        background: await getPostMeta<number>(post.id, 'background', 0),
        thumbnail: await getPostMeta<number>(post.id, '_thumbnail_id', 0),
    }

    for (const imageKey of Object.keys(imageIds)) {
        if (!imageIds[imageKey as POST_IMAGE_LOCATION]) {
            continue
        }
        const image = await getMedia(imageIds[imageKey as POST_IMAGE_LOCATION])

        if (image) {
            result[imageKey as POST_IMAGE_LOCATION] = image
        }
    }

    return result
}

const getTermsByPost = async (id: number): Promise<T_Archive[]> =>
    await MySQL.getInstance().select<T_Archive>(MySQLQuery.getTaxonomies(id))
