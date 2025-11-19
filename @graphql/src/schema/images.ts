import { ImageBlock } from '@src/schema/image-block'

/**
 * Collection of named image locations used by various schema models.
 * Each property is an `ImageBlock` describing that image slot.
 */
export const Images = {
    list: ImageBlock,
    icon: ImageBlock,
    title: ImageBlock,
    background: ImageBlock,
    thumbnail: ImageBlock,
}
