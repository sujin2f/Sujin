import {
    type ImageType,
    type ImageBlockType,
    ImagesType,
} from '@app/_lib/data/mysql/types'
import { IMAGE_SIZE, POST_IMAGE_LOCATION } from '@app/_lib/data/types'

type input = Record<string, unknown>

export const formatImage = (image: input): ImageType =>
    (image
        ? {
              url: image.url,
              width: image.width,
              height: image.height,
              mimeType: image.mimeType,
          }
        : {}) as ImageType

export const formatImageBlock = (image: input): ImageBlockType => {
    if (!image) {
        return {} as ImageBlockType
    }
    const sizes: input = {}
    if (image && 'sizes' in image) {
        const obj = image.sizes as input
        Object.keys(obj).forEach((key) => {
            if ((Object.values(IMAGE_SIZE) as string[]).includes(key)) {
                const image = obj[key] as input
                sizes[key] = formatImage(image)
            }
        })
    }

    return {
        url: image.url,
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        title: image.title,
        sizes,
    } as ImageBlockType
}

export const formatPostImage = (images: input): ImagesType => {
    const result: input = {}
    Object.keys(images).forEach((key) => {
        if ((Object.values(POST_IMAGE_LOCATION) as string[]).includes(key)) {
            const block = images[key] as input
            result[key] = formatImageBlock(block)
        }
    })

    return result as ImagesType
}
