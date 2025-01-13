'use server'

import { isEmpty } from '@common/utils/object'
import { MetaKeys } from '@src/constants/mysql-query'
import type { Image, ImageSizes, MediaRawData } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
import { request as getPost } from '@src/db/mysql/getPost'
import { getPostMeta } from '@src/db/mysql/getPostMeta'

export const getMedia = async (postId: number): Promise<Nullable<Image>> => {
    const result = {} as Image

    const post = await getPost('id', postId, true)
    if (!post) {
        return
    }

    result.mimeType = post.mimeType
    result.title = post.title

    const meta = await getPostMeta<MediaRawData>(
        postId,
        MetaKeys.ATTACHMENT_META,
        {} as MediaRawData,
    )
    if (isEmpty(meta)) {
        return
    }

    // Map sizes
    result.sizes = [] as ImageSizes
    result.url = post.link.replace(/[0-9]+\/[0-9]+\/.+$/, meta.file)

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
