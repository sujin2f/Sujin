/* CONSTANTS */
import { DEFAULT_THUMBNAIL } from '@lib/constants'
import { IMAGE_SIZE } from '@sujin/lib/constants'
/* T_Types */
import type { T_PostImages, T_ImageBlock } from '@sujin/lib/types'

export const getThumbnailFromPost = (images: T_PostImages, sizes: IMAGE_SIZE[]) => {
    if (!images) return DEFAULT_THUMBNAIL
    const availableSizes = {
        ...(images.thumbnail?.sizes || {}),
        ...(images.list?.sizes || {}),
    }
    const image = sizes.map((size) => availableSizes[size])[0]

    return image?.url || DEFAULT_THUMBNAIL
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
