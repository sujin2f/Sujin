import { Image } from '@src/schema/image'

/**
 * Schema fragment describing named image size variants that map to the
 * `Image` schema. Used by `ImageBlock.sizes` to group different variants.
 */
export const ImageSize = {
    medium: Image,
    mediumLarge: Image,
    large: Image,
    thumbnail: Image,
    postThumbnail: Image,
    relatedPost: Image,
    recentPost: Image,
}
