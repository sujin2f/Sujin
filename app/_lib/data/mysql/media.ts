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
import {
    type ImageBlockType,
    type MySQLMediaType,
    type MySQLPostType,
    IMAGE_TYPE,
    POST_TYPE,
    IMAGE_SIZE,
} from '@app/_lib/data/mysql/types'
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
    const meta = await getPostMeta<MySQLMediaType>(
        post.id,
        MetaKeys.ATTACHMENT_META,
        {} as MySQLMediaType,
    )
    if (isEmpty(meta)) {
        return
    }

    const result: ImageBlockType = {
        mimeType: post.mimeType,
        title: post.title,
        url: meta.file,
        width: meta.width,
        height: meta.height,
    }

    if (meta.sizes) {
        const urlBase = result.url.replace(/\/[a-zA-Z0-9-_.]+$/, '')
        result.sizes = {}

        Object.keys(meta.sizes).forEach((size) => {
            const mySQLKey = size as IMAGE_SIZE
            let key = size as IMAGE_SIZE

            switch (size) {
                case 'medium_large':
                    key = IMAGE_SIZE.MEDIUM_LARGE
                    break
                case 'post-thumbnail':
                    key = IMAGE_SIZE.POST_THUMBNAIL
                    break
                case 'related-post':
                    key = IMAGE_SIZE.RELATED_POST
                    break
                case 'recent-post':
                    key = IMAGE_SIZE.RECENT_POST
                    break
            }
            result.sizes![key] = {
                url: `${urlBase}/${meta.sizes[mySQLKey].file}`,
                width: meta.sizes[mySQLKey].width,
                height: meta.sizes[mySQLKey].height,
                mimeType: meta.sizes[mySQLKey]['mime-type'],
            }
        })
    }

    return result
}

export const getMedia = async (
    postId: number,
): Promise<Nullable<ImageBlockType>> => {
    const post = await getPostBy('id', postId, POST_TYPE.ATTACHMENT, true)
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

    const imageIds: Record<IMAGE_TYPE, number> = {
        list: await getPostMeta<number>(post.id, 'list', 0),
        icon: await getPostMeta<number>(post.id, 'icon', 0),
        title: await getPostMeta<number>(post.id, 'title', 0),
        background: await getPostMeta<number>(post.id, 'background', 0),
        thumbnail: await getPostMeta<number>(post.id, '_thumbnail_id', 0),
    }

    for (const imageKey of Object.keys(imageIds)) {
        if (!imageIds[imageKey as IMAGE_TYPE]) {
            continue
        }
        const image = await getMedia(imageIds[imageKey as IMAGE_TYPE])

        if (image) {
            result[imageKey as IMAGE_TYPE] = image
        }
    }

    return result
}
