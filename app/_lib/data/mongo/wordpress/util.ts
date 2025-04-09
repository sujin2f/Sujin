import type {
    T_Image,
    T_ImageBlock,
    T_ImageSize,
    T_PostImages,
} from '@app/_lib/types'
import { IMAGE_SIZE, POST_IMAGE_LOCATION } from '@app/_lib/types'
import { entries, isEmpty } from '@common/utils/object'

const formatImage = (image: T_Image): T_Image =>
    (image
        ? {
              url: image.url,
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
          }
        : {}) as T_Image

export const formatImageBlock = <
    T extends T_ImageBlock,
    U extends Partial<typeof IMAGE_SIZE>,
>(
    image: T,
    sizeType: U,
): T => {
    if (!image) {
        return {} as T
    }
    const sizes: T_ImageSize = {}
    if (image && 'sizes' in image) {
        entries(image.sizes!).forEach(([key, value]) => {
            if (Object.values(sizeType).includes(key)) {
                const formatted = formatImage(value)
                if (!isEmpty(formatted)) {
                    sizes[key] = formatImage(value)
                }
            }
        })
    }

    const result = {
        url: image.url,
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        title: image.title,
    }

    if (isEmpty(sizes)) {
        return result as T
    }

    return { ...result, sizes } as T
}

export const formatPostImage = (images: T_PostImages): T_PostImages => {
    const result: T_PostImages = {}
    entries(images).forEach(([key, value]) => {
        if (Object.values(POST_IMAGE_LOCATION).includes(key)) {
            result[key] = formatImageBlock(value, IMAGE_SIZE)
        }
    })

    return result
}
