import { ImageSize } from '@src/schema/image-size'

/**
 * Reusable image block schema fragment describing image metadata.
 *
 * Fields:
 * - `url`: image URL
 * - `mimeType`: MIME type string
 * - `width` / `height`: dimensions
 * - `sizes`: nested `ImageSize` object with various size variants
 */
export const ImageBlock = {
    url: {
        type: String,
    },
    mimeType: {
        type: String,
    },
    width: Number,
    height: Number,
    sizes: ImageSize,
}
