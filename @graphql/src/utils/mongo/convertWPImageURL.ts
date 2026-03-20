/* CONSTANTS */
import { IMAGE_SIZE } from '@common/constants'
/* T_Types */
import type { T_ImageBlock } from '@common/types'

/**
 * Normalize/convert a URL or path value for WordPress-uploaded images.
 *
 * The function attempts to parse the incoming `url` as a full URL and
 * extract its `pathname`. If parsing fails it treats the value as a
 * pathname already. It then ensures the path is rooted under
 * `wp-content/uploads` and always returns a leading slash.
 *
 * @param url - A full URL or a path-like string.
 * @returns A normalized path beginning with `/wp-content/uploads/...`.
 */
const replaceURL = (url: string): string => {
    let pathname: string

    if (!url) return ''

    try {
        pathname = new URL(url).pathname
    } catch {
        pathname = url
    }

    if (pathname.startsWith('/')) {
        pathname = pathname.slice(1)
    }
    if (!pathname.startsWith('wp-content/uploads')) {
        pathname = `wp-content/uploads/${pathname}`
    }

    return `/${pathname}`
}

/**
 * Convert all image size URLs inside a WordPress image block to normalized
 * local paths and return a new `T_ImageBlock` with a normalized `url`.
 *
 * @param imageBlock - Image block object with optionally multiple `sizes`.
 * @returns A new `T_ImageBlock` with normalized `url` and `sizes[*].url` values.
 */
export const convertWPImageURL = (imageBlock: T_ImageBlock): T_ImageBlock => {
    const sizes = imageBlock.sizes

    if (sizes) {
        Object.keys(sizes).forEach((size) => {
            const key = size as IMAGE_SIZE
            sizes[key]!.url = replaceURL(sizes[key]!.url)
        })
    }

    return {
        ...imageBlock,
        url: replaceURL(imageBlock.url),
    }
}
