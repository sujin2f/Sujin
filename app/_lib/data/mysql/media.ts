/* Models */
import MySQL from '@app/_lib/data/mysql'
import Logger from '@common/model/Logger'
/* Utils */
import { isEmpty } from '@common/utils/object'
import { getPostBy, getPostMeta } from '@app/_lib/data/mysql/post'
/* CONSTANTS */
import { MySQLQuery } from '@app/_lib/data/mysql/constants'
import {
    IMAGE_SIZE,
    POST_TYPE,
    type POST_IMAGE_LOCATION,
    type T_ImageBlock,
    type T_MySQLPost,
} from '@app/_lib/types'
/* Types */
import type { Nullable } from '@common/types'
import { ERROR_MESSAGE, ServerError } from '@app/_lib/constants-error'

enum META_KEYS {
    ATTACHMENT_META = '_wp_attachment_metadata',
}

/**
 * Get backgrounds from MySQL
 * @returns {Promise<T_ImageBlock[]>}
 * @throws
 */
export const getBackgrounds = async (): Promise<T_ImageBlock[]> => {
    Logger.server('Access MySQL for getting backgrounds.')
    const result = await MySQL.getInstance()
        .select<T_MySQLPost>(MySQLQuery.getBackgrounds())
        .then(async (posts) => {
            const result: T_ImageBlock[] = []
            for await (const post of posts) {
                result.push(await getMediaFromPost(post))
            }
            return result
        })

    if (!result.length)
        throw new ServerError(
            ERROR_MESSAGE.ATTACHMENT.EMPTY_BACKGROUNDS,
            'getBackgrounds()',
        )

    return result
}

/**
 * Get attachment info from attachment post
 * @param post
 * @returns
 * @throws
 */
const getMediaFromPost = async (post: T_MySQLPost): Promise<T_ImageBlock> => {
    const WP_IMAGE_SIZE = {
        medium_large: IMAGE_SIZE.MEDIUM_LARGE,
        'post-thumbnail': IMAGE_SIZE.POST_THUMBNAIL,
        'related-post': IMAGE_SIZE.RELATED_POST,
        'recent-post': IMAGE_SIZE.RECENT_POST,
    } as const
    type WP_IMAGE_SIZE = keyof typeof WP_IMAGE_SIZE
    type T_WPMedia = Pick<T_ImageBlock, 'width' | 'height'> & {
        file: string
        sizes: Record<
            string,
            {
                file: string
                width: number
                height: number
                'mime-type': string
            }
        >
    }

    const meta = await getPostMeta<T_WPMedia>(
        post.id,
        META_KEYS.ATTACHMENT_META,
        {} as T_WPMedia,
    )
    if (isEmpty(meta))
        throw new ServerError(
            ERROR_MESSAGE.ATTACHMENT.EMPTY_POST_META,
            'getMediaFromPost()',
            post.id,
        )

    const result: Record<string, unknown> = {
        mimeType: post.mimeType,
        title: post.title,
        url: meta.file,
        width: meta.width,
        height: meta.height,
    }

    if (meta.sizes) {
        const sizes: Record<string, unknown> = {}
        const location = (result.url as string).replace(
            /\/[a-zA-Z0-9-_.]+$/,
            '',
        )

        Object.entries(meta.sizes).forEach(([key, image]) => {
            const mongoSize =
                key in WP_IMAGE_SIZE ? WP_IMAGE_SIZE[key as WP_IMAGE_SIZE] : key
            const file = image.file.startsWith('/')
                ? image.file.slice(1)
                : image.file
            sizes[mongoSize] = {
                url: image.file.includes('/')
                    ? `/${file}`
                    : `${location}/${image.file}`,
                width: image.width,
                height: image.height,
                mimeType: image['mime-type'],
            }
        })
        result.sizes = sizes
    }

    return result as T_ImageBlock
}

export const getMedia = async (
    postId: number,
): Promise<Nullable<T_ImageBlock>> => {
    const post = await getPostBy('id', postId, POST_TYPE.ATTACHMENT, true)
    if (!post) {
        return
    }

    return getMediaFromPost(post)
}

type getPostImagesReturnType = {
    list?: T_ImageBlock
    icon?: T_ImageBlock
    title?: T_ImageBlock
    background?: T_ImageBlock
    thumbnail?: T_ImageBlock
}
export const getPostImages = async (
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
