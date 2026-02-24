/* CONSTANTS */
import { DEFAULT_THUMBNAIL } from '@app/_lib/constants'
import { IMAGE_SIZE } from '@sujin/lib/constants'
/* T_Types */
import type { T_PostImages, T_ShortcodeNamed } from '@sujin/lib/types'

export const replaceQuotes = (matched: T_ShortcodeNamed, key: string) => {
    const regex = /(&#8221;|&#8243;|\/\])/g
    return (matched[key] && matched[key].replace(regex, '')) || ''
}

export const getThumbnailFromPost = (images: T_PostImages, sizes: IMAGE_SIZE[]) => {
    if (!images) return DEFAULT_THUMBNAIL
    const availableSizes = {
        ...(images.thumbnail?.sizes || {}),
        ...(images.list?.sizes || {}),
    }
    const image = sizes.map((size) => availableSizes[size])[0]

    return image?.url || DEFAULT_THUMBNAIL
}
