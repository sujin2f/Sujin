import { DEFAULT_THUMBNAIL } from '@app/_lib/constants'
import {
    IMAGE_SIZE,
    type T_PostImages,
    type T_ImageBlock,
} from '@app/_lib/types'

export const getThumbnailFromPost = (
    images: T_PostImages,
    size: IMAGE_SIZE,
) => {
    if (!images) return DEFAULT_THUMBNAIL
    return (
        images.list?.sizes?.[size]?.url ||
        images.thumbnail?.sizes?.[size]?.url ||
        DEFAULT_THUMBNAIL
    )
}

const replaceURL = (url: string) => {
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

export const convertImageBlockURL = (imageBlock: T_ImageBlock) => {
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
