/* Utils */
import { getPostBy } from '@src/utils/mysql/post'
import { isEmpty } from '@sujin/share/utils/object'
import { getPostMeta } from '@src/utils/mysql/post-meta'
/* Models */
import { select } from '@src/utils/mysql'
import { FetchError } from '@sujin/share/model/Error'
/* CONSTANTS */
import { WPQuery } from '@src/utils/mysql/wp-query'
import { POST_TYPE, IMAGE_SIZE } from '@sujin/lib/constants'
/* T_Types */
import {
    type T_ImageBlock,
    type T_Background,
    type T_MySQLPost,
} from '@sujin/lib/types'
import type { Nullable } from '@sujin/share/types'

enum META_KEYS {
    ATTACHMENT_META = '_wp_attachment_metadata',
}

/**
 * Get attachment info from attachment post
 * @param post
 * @returns
 * @throws
 */
const getImageBlockFromPost = async <T extends T_ImageBlock>(
    post: T_MySQLPost,
): Promise<T> => {
    const WP_IMAGE_SIZE = {
        medium_large: IMAGE_SIZE.MEDIUM_LARGE,
        'post-thumbnail': IMAGE_SIZE.POST_THUMBNAIL,
        'related-post': IMAGE_SIZE.RELATED_POST,
        'recent-post': IMAGE_SIZE.RECENT_POST,
    } as const
    type WP_IMAGE_SIZE = keyof typeof WP_IMAGE_SIZE
    type T_WPMedia = Pick<T, 'width' | 'height'> & {
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
        throw new FetchError(
            `Failed to find MySQL attached media with post ID: ${post.id}`,
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

    return result as T
}

export const getImageBlockFromAttachmentID = async (
    postId: number,
): Promise<Nullable<T_ImageBlock>> => {
    const post = await getPostBy('id', postId, POST_TYPE.ATTACHMENT, true)
    if (!post) {
        return
    }
    return getImageBlockFromPost(post)
}

/**
 * Get backgrounds from MySQL
 * @returns {Promise<T_ImageBlock[]>}
 * @throws
 */
export const getBackgrounds = async (): Promise<T_Background[]> => {
    const result = await select<T_MySQLPost>(WPQuery.getBackgrounds()).then(
        async (posts: T_MySQLPost[]) => {
            const result: T_Background[] = []
            for await (const post of posts) {
                result.push(await getImageBlockFromPost(post))
            }
            return result
        },
    )

    if (!result.length) throw new FetchError('MySQL Background is empty')

    return result
}
