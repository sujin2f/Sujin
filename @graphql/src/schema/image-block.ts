import { ImageSize } from '@src/schema/image-size'

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
