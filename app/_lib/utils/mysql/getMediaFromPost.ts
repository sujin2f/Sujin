/* Models */
import { FetchError } from '@sujin/common/model/Error'
/* Utils */
import { isEmpty } from '@sujin/common/utils/object'
import { getPostMeta } from '@app/_lib/utils/mysql/getPostMeta'
/* CONSTANTS */
import {
    IMAGE_SIZE,
    type T_ImageBlock,
    type T_MySQLPost,
} from '@app/_lib/types'

enum META_KEYS {
    ATTACHMENT_META = '_wp_attachment_metadata',
}

/**
 * Get attachment info from attachment post
 * @param post
 * @returns
 * @throws
 */
export const getMediaFromPost = async <T extends T_ImageBlock>(
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
