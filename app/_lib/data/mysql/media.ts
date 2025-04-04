/* Models */
import MySQL from '@app/_lib/data/mysql'
import Logger from '@common/model/Logger'
/* Utils */
import { isEmpty } from '@common/utils/object'
import { getPostBy, getPostMeta } from '@app/_lib/data/mysql/post'
/* Constants */
import { MySQLQuery } from '@app/_lib/data/mysql/constants'
import { MetaKeys } from '@app/_lib/data/mysql/constants'
/* Types */
import type {
    ImageBlockType,
    MySQLMediaType,
    ImageType,
    MySQLPostType,
    ImageKeysType,
} from '@app/_lib/types/wordpress'
import type { Nullable } from '@common/types'

export const getBackgrounds = async (): Promise<ImageBlockType[]> => {
    Logger.server('Access MySQL for getting backgrounds.')
    const result: ImageBlockType[] = []
    const posts = await MySQL.getInstance().select<MySQLPostType>(
        MySQLQuery.getBackgrounds(),
    )

    for await (const post of posts) {
        const image = await getMediaFromPost(post)

        if (image) {
            result.push(image)
        }
    }

    if (!result.length) {
        throw Error(`Background is empty.`)
    }

    return result
}

const getMediaFromPost = async (
    post: MySQLPostType,
): Promise<Nullable<ImageBlockType>> => {
    const result = {} as ImageBlockType
    result.mimeType = post.mimeType
    result.title = post.title

    const meta = await getPostMeta<MySQLMediaType>(
        post.id,
        MetaKeys.ATTACHMENT_META,
        {} as MySQLMediaType,
    )
    if (isEmpty(meta)) {
        return
    }

    // Map sizes
    result.sizes = [] as ImageType[]
    result.url = meta.file

    if (meta.sizes) {
        const urlBase = result.url.replace(/\/[a-zA-Z0-9-_.]+$/, '')

        Object.keys(meta.sizes).forEach((key) => {
            result.sizes.push({
                key,
                file: `${urlBase}/${meta.sizes[key].file}`,
            })
        })
    }

    return result
}

export const getMedia = async (
    postId: number,
): Promise<Nullable<ImageBlockType>> => {
    const post = await getPostBy('id', postId, 'attachment', true)
    if (!post) {
        return
    }

    return getMediaFromPost(post)
}

type getPostImagesReturnType = {
    list?: ImageBlockType
    icon?: ImageBlockType
    title?: ImageBlockType
    background?: ImageBlockType
    thumbnail?: ImageBlockType
}
export const getPostImages = async (
    post: MySQLPostType,
): Promise<getPostImagesReturnType> => {
    const result: getPostImagesReturnType = {}

    const imageIds: Record<ImageKeysType, number> = {
        list: await getPostMeta<number>(post.id, 'list', 0),
        icon: await getPostMeta<number>(post.id, 'icon', 0),
        title: await getPostMeta<number>(post.id, 'title', 0),
        background: await getPostMeta<number>(post.id, 'background', 0),
        thumbnail: await getPostMeta<number>(post.id, '_thumbnail_id', 0),
    }

    for (const imageKey of Object.keys(imageIds)) {
        if (!imageIds[imageKey as ImageKeysType]) {
            continue
        }
        const image = await getMedia(imageIds[imageKey as ImageKeysType])

        if (image) {
            result[imageKey as ImageKeysType] = image
        }
    }

    return result
}
