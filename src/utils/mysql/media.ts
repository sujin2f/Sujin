import { isEmpty } from 'src/common/utils/object'
import { MetaKeys, MySQLQuery } from 'src/constants/mysql-query'
import { Image, ImageSizes, Post, MediaRawData } from 'src/types/wordpress'
import { Nullable } from 'src/types/common'
import { getPost } from 'src/utils/mysql/posts'
import { getPostMeta } from 'src/utils/mysql/post-meta'
import { MySQL } from 'src/utils/mysql/mysqld'

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
        const urlBase = result.url.replace(/\/[a-zA-Z0-9-_\.]+$/, '')

        Object.keys(meta.sizes).forEach((key) => {
            result.sizes.push({
                key,
                file: `${urlBase}/${meta.sizes[key].file}`,
            })
        })
    }

    return result
}

export const getBackgrounds = async (): Promise<Image[]> => {
    const result = []
    const mysql = MySQL.getInstance()
    const query = MySQLQuery.getRandomBackgrounds()
    const posts = await mysql.select<Post>(query)

    for await (const post of posts) {
        const image = await getMedia(post.id)

        if (image) {
            result.push(image)
        }
    }

    return result
}
